class  Api::V1::SubcategoriesController < ApplicationController
  before_action :authenticate_user!
  skip_before_action :verify_authenticity_token

  include PaginationHelper
  before_action :set_subcategory, only: %i[ show edit update destroy ]

    # GET /subcategories
    def index
      @subcategories = Subcategory.all
      pagination_info = paginate_records(@subcategories)
      render_pagination(pagination_info, Api::V1::SubcategorySerializer, code: 200, message: 'Subcategory Fetched Successfully')
    end

    # GET /subcategories/1
    def show
    @subcategory = Subcategory.find(params[:id])
    if @subcategory
      render json:{ status: { code: 200, message: 'Categories Fetched Successfully'}, subcategory: @subcategory }, status: :ok
    else
      render json: { code: 404, message: 'Category Not Found', errors: @subcategory.errors.full_messages }, status: :not_found
    end
  end

    # GET /subcategories/new
    def new
      @subcategory = Subcategory.new
    end

    # GET /subcategories/1/edit
    def edit
    end

    # POST /subcategories
    def create
      @subcategory = Subcategory.new(subcategory_params)
      if @subcategory.save
        render json: { code: 201, message: 'Subcategory created successfully', subcategory: @subcategory }, status: :created
      else
        render json: { code: 422, message: 'Unable to create the Subcategory', errors: @subcategory.errors.full_messages }, status: :unprocessable_entity
      end
    end

    # PATCH/PUT /subcategories/1
    def update
      if @subcategory.update(subcategory_params)
        render json: @subcategory, status: :created
      else
        render :edit, status: :unprocessable_entity
      end
    end

    # DELETE /subcategories/1
    def destroy
      @subcategory.destroy
    end

    private
      # Use callbacks to share common setup or constraints between actions.
      def set_subcategory
        @subcategory = Subcategory.find(params[:id])
      end

      # Only allow a list of trusted parameters through.
      def subcategory_params
        params.require(:subcategory).permit(:name, :category_id)
      end
  end
