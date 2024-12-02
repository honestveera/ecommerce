require 'zip'
require 'csv'

class Api::V1::ImportBooksController < ApplicationController
  include PaginationHelper
  before_action :set_book, only: %i[show edit update destroy]
  skip_before_action :verify_authenticity_token

  def upload_zip_file
    if params[:zip_file]
      zip_file = params[:zip_file]
      # Save the uploaded ZIP file to a temporary location on the server
      File.open(Rails.root.join('tmp', zip_file.original_filename), 'wb') do |file|
        file.write(zip_file.read)
      end
      render json: { message: 'ZIP file uploaded successfully' }, status: :ok
    else
      render json: { error: 'No file provided' }, status: :unprocessable_entity
    end
  end

  def process_uploaded_zip_file
    user_id = current_user.id 
    uploaded_zip_path = Rails.root.join('tmp', params[:zip_file_name])

    if File.exist?(uploaded_zip_path)
      matched_data = []
      mismatched_data = []

      begin
        Zip::File.open(uploaded_zip_path) do |zipfile|
          zipfile.each do |entry|
            if entry.name =~ /\.csv$/
              csv_data = entry.get_input_stream.read
              cleaned_csv_data = clean_csv_data(csv_data)

              CSV.parse(cleaned_csv_data, headers: true) do |row|
                category = Category.find_by(name: row['category'])
                author = Author.find_by(name: row['author'])
                publisher = Publisher.find_by(name: row['publisher'])
                subcategory = Subcategory.find_by(name: row['subcategory'])
              
                if category && author && publisher && subcategory
                 image_path = row['image_name'].presence ? save_file_for_import(row['image_name']) : "public/uploads/noimage.png"
                 File.open(image_path, 'wb') do |file|
                  file.write(File.read(row['image_name'])) if row['image_name'].present?
                end

                  book_data = {
                  name: row['name'],
                  category_id: category&.id,
                  author_id: author&.id,
                   publisher_id: publisher&.id,
                   subcategory_id: subcategory&.id,
                   isbn_number: row['isbn_number'],
                   user_id: user_id,
                   image_name: image_path,
                }
                   matched_data << book_data

                else
                  mismatched_columns = {}
                  mismatched_columns['Category'] = row['category'] unless category
                  mismatched_columns['Author'] = row['author'] unless author
                  mismatched_columns['Publisher'] = row['publisher'] unless publisher
                  mismatched_columns['Subcategory'] = row['subcategory'] unless subcategory
                  mismatched_data << mismatched_columns
                end
              end
            end
          end
        end

        Book.create(matched_data) unless matched_data.empty?

        if mismatched_data.empty?
          render json: { message: 'ZIP file processed successfully' }, status: :ok
        else
          render json: { message: 'Some data could not be processed', mismatched_data: mismatched_data }, status: :ok
        end
      rescue StandardError => e
        render json: { error: "Error processing ZIP file: #{e.message}" }, status: :unprocessable_entity
      ensure
        # Clean by deleting the uploaded ZIP file
        File.delete(uploaded_zip_path)
      end
    else
      render json: { error: 'ZIP file not found' }, status: :unprocessable_entity
    end
  end

  def index
    @books = Book.all
    pagination_info = paginate_records(@books)
    render_pagination pagination_info, Api::V1::BookSerializer
  end

  private

  def clean_csv_data(csv_data)
    cleaned_csv_data = csv_data.split("\n").map do |line|
      line.split(',').map(&:strip).join(',')
    end.join("\n")
  end

  def save_file_for_import(image_path)
    current_time = Time.now
    year_month_directory = current_time.strftime('%Y/%m')
    filename = File.basename(image_path) 
    file_path = 'public/uploads/'+year_month_directory+'/'+filename
    FileUtils.mkdir_p(File.dirname(file_path)) unless File.directory?(File.dirname(file_path))
    FileUtils.copy(image_path, file_path)
    file_path.to_s
  end 
end
