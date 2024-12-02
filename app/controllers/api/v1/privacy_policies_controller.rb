class Api::V1::PrivacyPoliciesController < ApplicationController
  before_action :authenticate_user_from_token!, only: [:create, :update, :destroy]
  skip_before_action :verify_authenticity_token
  include PaginationHelper
  before_action :set_privacy_policy, only: [:show ,:update, :destroy]

    def index
     @privacy_policies = PrivacyPolicy.all
     pagination_info = paginate_records(@privacy_policies)
     render_pagination(pagination_info,  Api::V1::PrivacyPolicySerializer, code: 200, message: 'privacy policies Fetched Successfully')
    end

    def show
      if @privacy_policy
        render json: { status: { code: 200, message: 'privacy policy fetched successfully' }, privacy_policy: Api::V1::PrivacyPolicySerializer.new(@privacy_policy) }, status: :ok
      else
        render json: { code: 404, message: 'privacy policy not found', errors: [' with the provided ID not found'] }, status: :not_found
      end
    end

    def list
      @privacy_policies= PrivacyPolicy.all
    end

     def new
      @privacy_policy = PrivacyPolicy.new
    end

    def edit
    end

    def create
      @privacy_policy = PrivacyPolicy.new(privacy_policy_params)

      if @privacy_policy.save
        render json: @privacy_policy, status: :created
      else
        render json: { errors: @privacy_policy.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def update
      if @privacy_policy.update(privacy_policy_params)
        render json: @privacy_policy
      else
        render json: { errors: @privacy_policy.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def destroy
      @privacy_policy.destroy
    end

    private

    def set_privacy_policy
      @privacy_policy = PrivacyPolicy.find_by(id: params[:id])
      unless @privacy_policy
        render json: { code: 404, message: 'privacy policy not found' }, status: :not_found
      end
    end

    def privacy_policy_params
      params.permit(:content)
    end
end
