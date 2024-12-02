# frozen_string_literal: true

class Api::V1::RegistrationsController < Devise::RegistrationsController
  skip_before_action :verify_authenticity_token
  skip_before_action :authenticate_user_from_token!
  respond_to :json

  def create
    build_resource(sign_up_params.except(:role))

    resource.save
    yield resource if block_given?   
    if resource.persisted?
      UserRole.create_user_role(resource.id, sign_up_params[:role])
      sign_up(resource_name, resource)
      render json: {
        status: { code: 200, message: 'Signed up successfully.' },
        data: resource
      }, status: :ok
    else
      clean_up_passwords resource
      set_minimum_password_length
      render json: {
        status: { code: 422, message: "User couldn't be created successfully. #{resource.errors.full_messages.to_sentence}" }
      }, status: :unprocessable_entity
    end
  end

  private

  def sign_up_params
    params.require(:user).permit(:first_name, :last_name, :email, :phone_number, :employeeid, :gender, :phone, :office_address, :corporate_id, :password, :role)
  end

  def respond_with(resource, _opts = {})
    if request.method == 'POST' && resource.persisted?
      render json: {
        status: { code: 200, message: 'Signed up sucessfully.' },
        data: resource
      }, status: :ok
    elsif request.method == 'DELETE'
      render json: {
        status: { code: 200, message: 'Account deleted successfully.' }
      }, status: :ok
    else
      render json: {
        status: { code: 422, message: "User couldn't be created successfully. #{resource.errors.full_messages.to_sentence}" }
      }, status: :unprocessable_entity
    end
  end
end
