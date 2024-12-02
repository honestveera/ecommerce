class  Api::V1::CorporatesController < ApplicationController
  before_action :authenticate_user!

  include PaginationHelper

  before_action :set_corporate, only: %i[ show edit update destroy ]

  # GET /corporates
  def index
    @corporates = Corporate.all
    pagination_info = paginate_records(@corporates)
    render_pagination(pagination_info, Api::V1::CorporateSerializer, code: 200, message: 'Corporates Fetched Successfully')
  end

  # GET /corporates/1
  def show
    render json: @corporate
  end

  # GET /corporates/new
  def new
    @corporate = Corporate.new
  end

  # GET /corporates/1/edit
  def edit
  end

  # POST /corporates
  def create
    @corporate = Corporate.new(corporate_params)

    if @corporate.save
      render json: @corporate, notice: "Corporate was successfully created."
    else
      render json: @corporate.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /corporates/1
  def update
    if @corporate.update(corporate_params)
      render json: @corporate, notice: "Corporate was successfully updated."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  # DELETE /corporates/1
  def destroy
    @corporate.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_corporate
      @corporate = Corporate.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def corporate_params
      params.require(:corporate).permit(:name, :subscription_date, :validity, :active, :address)
    end
end
