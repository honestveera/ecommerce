class  Api::V1::CategoriesController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :authenticate_user!
  
  include PaginationHelper

  before_action :set_category, only: %i[ show edit update destroy ]

  # GET /categories
  def index
    @categories = Category.all
    pagination_info = paginate_records(@categories)
    render_pagination(pagination_info, Api::V1::CategorySerializer, code: 200, message: 'Categories Fetched Successfully')

  end

  # GET /categories/1
  def show
    @category = Category.find(params[:id])
    if @category
      # render json: { status: { code: 200, message: 'Categories Fetched Successfully' }, category: Api::V1::CategorySerializer.new(@category, each_serializer: Api::V1::SubcategorySerializer) }, status: :ok
      render json: { status: { code: 200, message: 'Categories Fetched Successfully' }, category: Api::V1::CategorySerializer.new(@category) }, status: :ok
    else
      render json: { code: 404, message: 'Category Not Found', errors: @category.errors.full_messages }, status: :not_found
    end
  end

  # GET /categories/new
  def new
    @category = Category.new
  end

  # GET /categories/1/edit
  def edit
  end

  # POST /categories
  def create
    @category = Category.new(category_params)
    if @category.save
      image = @category.image_name
      render json: { code: 201, message: 'Categories created successfully', category: @category, image_name: image  }, status: :created
    else
      render json: { code: 422, message: 'Unable to create the Category', errors: @category.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /categories/1
  def update
    if @category.update(category_params)
      render json: @category
    else
      render :edit, status: :unprocessable_entity
    end
  end

  # DELETE /categories/1
  def destroy
    @category.destroy
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
    def set_category
      @category = Category.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def category_params
      params.permit(:name, :image_name)
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
