class Api::V1::AuthorsController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :authenticate_user!
  
  include PaginationHelper
  before_action :set_author, only: %i[ show edit update destroy ]

  # GET /authors
  def index
    @authors = Author.all
    pagination_info = paginate_records(@authors)
    render_pagination(pagination_info, Api::V1::AuthorSerializer, code: 200, message: 'Authors Fetched Successfully')

  end

  # GET /authors/1
  def show
    @author = Author.find(params[:id])
    if @author
      render json: { status: { code: 200, message: 'Authors Fetched Successfully' }, author: Api::V1::AuthorSerializer.new(@author) }, status: :ok
    else
      render json: { code: 404, message: 'Authors Not Found', errors: @author.errors.full_messages }, status: :not_found
    end
  end

  # GET /authors/new
  def new
    @author = Author.new
  end

  # GET /authors/1/edit
  def edit
  end

  # POST /authors
  def create
    @author = Author.new(author_params)

    if @author.save
      image = @author.image_name
      render json: { code: 201, message: 'Author created successfully', author: @author, image_name: image }, status: :created
    else
      render json: { code: 422, message: 'Unable to create the Author', errors: @author.errors.full_messages }, status: :unprocessable_entity
    end
  end
  
# PATCH/PUT /authors/1
  def update
    if @author.update(author_params)
      render json: @author
    else
      render json: @author.errors, status: :unprocessable_entity
    end
  end

  # DELETE /authors/1
  def destroy
    @author.destroy
  end

  def upload
    uploaded_file = params[:image]
    file_path = save_file(uploaded_file)

    if file_path.present?
      render json: { filePath: file_path }
    else
      render json: { error: 'Error saving the file' }, status: :unprocessable_entity
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_author
      @author = Author.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def author_params
      params.permit(:name, :image_name, :biography)
    end

    def save_file(uploaded_file)
      return "public/uploads/noimage.png" unless uploaded_file.respond_to?(:original_filename)

      original_filename = uploaded_file.original_filename
      current_time = Time.now
      year_month_directory = current_time.strftime('%Y/%m')
      file_path = Rails.root.join('public', 'uploads', year_month_directory, original_filename)
      FileUtils.mkdir_p(File.dirname(file_path)) unless File.directory?(File.dirname(file_path))
      File.open(file_path, 'wb') do |file|
        file.write(uploaded_file.read)
      end
      # Return the file path
      "public/uploads/#{year_month_directory}/#{original_filename}"
    end
end