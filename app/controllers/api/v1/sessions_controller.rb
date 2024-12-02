class Api::V1::SessionsController < Devise::SessionsController
  skip_before_action :authenticate_user_from_token!
  skip_before_action :verify_authenticity_token
  respond_to :json

  def destroy
    user = current_user
    sign_out(user)
  end

    def create
      user = User.find_for_database_authentication(email: params[:user][:email])
     
      if user && user.valid_password?(params[:user][:password]) && user.approved_user?
        sign_in(user)
        respond_with(user)
      elsif user && user.valid_password?(params[:user][:password]) && !user.approved_user?
        render json: {
          status: { code: 401, message: 'Corporate approval needed for this user.' }
        }, status: :unauthorized
      else
        render json: {
          status: { code: 401, message: 'Invalid email or password.' }
        }, status: :unauthorized
      end
    end

  private

  def respond_with(resource, _opts = {})
    roles = resource.roles
    corporate = resource.corporate
    hash = {
      email: resource.email,
      corporate_id: corporate.id,
      corporate_name: corporate.name,
      role: roles.map(&:name).first,
      user_id: resource.id
    }

    render json: {
      status: { code: 200, message: 'Logged in sucessfully.' },
      token: request.env['warden-jwt_auth.token'],
      payload: request.env['warden-jwt_auth.payload'],
      data: hash
    }, status: :ok
  end

  def respond_to_on_destroy
    if current_user
      render json: {
        status: { code: 200, message: 'logged out successfully.' }
      }, status: :ok
    else
      render json: {
        status: { code: 401, message: "Couldn't find an active session." }
      }, status: :unauthorized
    end
  end
end