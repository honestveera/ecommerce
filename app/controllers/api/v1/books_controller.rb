class  Api::V1::BooksController < ApplicationController
  before_action :authenticate_user!
  skip_before_action :verify_authenticity_token

  include PaginationHelper
  before_action :set_book, only: %i[ show edit update destroy ]

  # GET /books
  def index
    @books = Book.retreive_books(params)
    pagination_info = paginate_records(@books)
    render_pagination(pagination_info, Api::V1::BookSerializer, code: 200, message: 'Books Fetched Successfully')
  end

  def show
    @book = Book.find(params[:id])
    if @book
      render json: { "status" => { "code" => 200, "message" => 'Books Fetched Successfully' }, "items" => ActiveModelSerializers::SerializableResource.new(@book, serializer: Api::V1::BookSerializer) }, status: :ok
    else
      render json: { code: 404, message: 'Author Not Found', errors: @book.errors.full_messages }, status: :not_found
    end
  end

  # GET /books/new
  def new
    @book = Book.new
  end

  # GET /books/1/edit
  def edit
  end

  # POST /books
  def create
    @book = Book.new(book_params)

    if @book.save
      image = @book.image_name
      render json: { code: 201, message: 'Book created successfully', book: @book, image_name: image }, status: :created
    else
      render json: { code: 422, message: 'Unable to create the book', errors: @book.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /books/1
  def update
    if @book.update(book_params)
      render json: @book
    else
      render json: @book.errors, status: :unprocessable_entity
    end
  end

  # DELETE /books/1
  def destroy
    @book.destroy
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
    def set_book
      @book = Book.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def book_params
      params.require(:book).permit(:name, :category_id, :subcategory_id, :author_id, :isbn_number, :publisher_id, :user_id, :image_name, :overview)
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
