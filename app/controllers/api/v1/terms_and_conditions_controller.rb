class Api::V1::TermsAndConditionsController < ApplicationController
  before_action :authenticate_user_from_token!, only: [:create, :update, :destroy]
  skip_before_action :verify_authenticity_token
  include PaginationHelper
  before_action :set_terms_and_condition, only: [:show, :update, :destroy]

  def index
    @terms_and_conditions = TermsAndCondition.all
    pagination_info = paginate_records(@terms_and_conditions)
    render_pagination(pagination_info, Api::V1::TermsAndConditionSerializer, code: 200, message: 'Terms and conditions fetched successfully')
  end

  def show
    if @terms_and_condition
      render json: { status: { code: 200, message: 'Terms and condition fetched successfully' }, terms_and_condition: Api::V1::TermsAndConditionSerializer.new(@terms_and_condition) }, status: :ok
    else
      render json: { code: 404, message: 'Terms and condition not found', errors: ['Terms and condition with the provided ID not found'] }, status: :not_found
    end
  end

  def list
    @terms_and_conditions = TermsAndCondition.all
    render json: @terms_and_conditions, status: :ok
  end

  def new
    @terms_and_condition = TermsAndCondition.new
  end

  def edit
  end

  def create
    @terms_and_condition = TermsAndCondition.new(terms_and_condition_params)

    if @terms_and_condition.save
      render json: @terms_and_condition, status: :created
    else
      render json: { errors: @terms_and_condition.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @terms_and_condition.update(terms_and_condition_params)
      render json: @terms_and_condition
    else
      render json: { errors: @terms_and_condition.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @terms_and_condition.destroy
  end

  private

  def set_terms_and_condition
    @terms_and_condition = TermsAndCondition.find_by(id: params[:id])

    unless @terms_and_condition
      render json: { code: 404, message: 'Terms and condition not found' }, status: :not_found
    end
  end

  def terms_and_condition_params
    params.permit(:content)
  end
end
