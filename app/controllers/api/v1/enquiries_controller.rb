class Api::V1::EnquiriesController < ApplicationController
  before_action :authenticate_user!
  skip_before_action :verify_authenticity_token

  include PaginationHelper
  before_action :set_enquiry, only: %i[ show edit update destroy ]

  # GET /enquiries
  def index
    @enquiries = Enquiry.all
    pagination_info = paginate_records(@enquiries)
    render_pagination(pagination_info, Api::V1::EnquirySerializer, code: 200, message: 'Enquiry Fetched Successfully')
  end

  # GET /enquiries/1
  def show
    render json: @enquiry
  end

  # GET /enquiries/new
  def new
    @enquiry = Enquiry.new
  end

  # GET /enquiries/1/edit
  def edit
  end

  # POST /enquiries
  def create
    @enquiry = Enquiry.new(enquiry_params)

    if @enquiry.save
      render json: @enquiry, status: :created
    else
      render json: @enquiry.errors, status: :unprocessable_entity
    end
  end
  
# PATCH/PUT /enquiries/1
  def update
    if @enquiry.update(enquiry_params)
      render json: @enquiry
    else
      render json: @enquiry.errors, status: :unprocessable_entity
    end
  end

  # DELETE /enquiries/1
  def destroy
    @enquiry.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_enquiry
      @enquiry = Enquiry.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def enquiry_params
      params.require(:enquiry).permit(:name, :email, :message, :mobile, :role, :employee_size, :company_name)
    end
end
