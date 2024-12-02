class Api::V1::PasswordsController < Devise::PasswordsController
  skip_before_action :authenticate_user_from_token!
  skip_before_action :verify_authenticity_token
  respond_to :json

  def create 
    self.resource = resource_class.find_by(email: params[:email])
    if resource.present?
      raw = resource.send_reset_password_instructions
      render json: { status: "Password reset instructions sent successfully", 
                     reset_password_token: raw }, status: :ok
    else
      render json: { errors: ['Email not found.'] }, status: :not_found
    end
  end

  def update
    user = User.reset_password_by_token(
      reset_password_token: params[:reset_password_token],
      password: params[:password],
      password_confirmation: params[:password_confirmation]
    )

    if user.errors.empty?
      render json: { status: 'Password successfully updated.' }, status: :ok
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end
end
