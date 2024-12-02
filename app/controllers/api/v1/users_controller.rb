class Api::V1::UsersController < ApplicationController
    skip_before_action :verify_authenticity_token
    before_action :authenticate_user!
    before_action :set_user, only: [:show, :update, :destroy, :update_company_approval]

    include PaginationHelper
  
    # GET /api/v1/users
    def index
      @users = User.retrive_users(params)
      pagination_info = paginate_records(@users)
      render_pagination(pagination_info, Api::V1::UserSerializer, code: 200, message: 'Users Fetched Successfully')
    end
  
    # GET /api/v1/users/1
    def show
      render json: @user
    end
  
    # POST /api/v1/users
    def create
      @user = User.new(user_params)
  
      if @user.save
        render json: @user, status: :created
      else
        render json: @user.errors, status: :unprocessable_entity
      end
    end

    def update_company_approval
      if @user.update(corporate_approval_flag: params[:approved])
        render json: @user, notice: "Corporate approved the user #{@user.first_name} !!!"
      else
        render json: @user.errors, status: :unprocessable_entity
      end
    end
  
    # PATCH/PUT /api/v1/users/1
    def update
      if @user.update(user_params)
        render json: @user
      else
        render json: @user.errors, status: :unprocessable_entity
      end
    end
  
    # DELETE /api/v1/users/1
    def destroy
      @user.destroy
    end
  
    private
      # Use callbacks to share common setup or constraints between actions.
      def set_user
        @user = User.find(params[:id])
      end
  
      # Only allow a list of trusted parameters through.
      def user_params
        params.require(:user).permit(:first_name, :last_name, :email, :employeeid, :gender, :phone, :office_address, :corporate_id, :password)
      end
  end
  
