class  Api::V1::PublishersController < ApplicationController
  before_action :authenticate_user!

  include PaginationHelper
  before_action :set_publisher, only: %i[ show edit update destroy ]

  # GET /publishers
  def index
    @publishers = Publisher.all
    pagination_info = paginate_records(@publishers)
    render_pagination(pagination_info, Api::V1::PublisherSerializer, code: 200, message: 'Publisherss Fetched Successfully')
  end

  # GET /publishers/1
  def show
    @publisher = Publisher.find(params[:id])
    if @publisher
      render json: { status: { code: 200, message: 'Publishers Fetched Successfully' }, publisher: Api::V1::PublisherSerializer.new(@publisher) }, status: :ok
    else
      render json: { code: 404, message: 'Publisher Not Found', errors: @publisher.errors.full_messages }, status: :not_found
    end
  end

  # GET /publishers/new
  def new
    @publisher = Publisher.new
  end

  # GET /publishers/1/edit
  def edit
  end

  # POST /publishers
  def create
    @publisher = Publisher.new(publisher_params)
    if @publisher.save
      # render json: @publisher, status: :created
      render json: { code: 201, message: 'Publisher created successfully', publisher: @publisher }, status: :created
    else
      # render json: @publisher.errors, status: :unprocessable_entity
      render json: { code: 422, message: 'Unable to create the Publisher', errors: @publisher.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /publishers/1
  def update
    if @publisher.update(publisher_params)
      render json: @publisher
    else
      render json: @publisher.errors, status: :unprocessable_entity
    end
  end

  # DELETE /publishers/1
  def destroy
    @publisher.destroy  
   
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_publisher
      @publisher = Publisher.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def publisher_params
      params.require(:publisher).permit(:name)
    end
end
