class ApplicationController < ActionController::Base
 before_action :authenticate_user_from_token!

  def authenticate_user_from_token!
    if user_signed_in?
      if request.headers['Authorization'].blank?
        render json: { message: 'Please enter valid authorization token' }, status: :unauthorized
      elsif token_expired?
        sign_out(current_user) if current_user.present?
        render json: { message: 'Session expired or Invalid token. Please log in again.' }, status: :unauthorized
      end
    else
      render json: { message: 'Session expired or Invalid token. Please log in again.' }, status: :unauthorized
    end
  end

  def token_expired?
    jwt_token = request.headers['Authorization'].split(' ').last
    decoded_token = JWT.decode(jwt_token, ENV['DEVISE_SECRET_KEY'], true, algorithm: 'HS256').first
    current_user && decoded_token['exp'].to_i < Time.now.to_i
  rescue JWT::ExpiredSignature
    return true
  rescue JWT::DecodeError
    return true
  end
end
