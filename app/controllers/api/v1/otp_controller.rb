class Api::V1::OtpController < ApplicationController
  skip_before_action :verify_authenticity_token
  skip_before_action :authenticate_user_from_token!
  before_action :validate_params, only: [:validate_otp]
  before_action :send_params, only: [:send_otp]

  def send_otp
    otp = rand(100_000..999_999).to_s
    params.require(:phone_number)
    current_user = User.find_by_phone_number(params[:phone_number])

    return render json: { message: "User phonenumber not registered" } unless current_user
    current_user.update(otp_secret: otp, otp_sent_at: Time.now)

    begin
      client = Twilio::REST::Client.new 
      client.messages.create(
        to: params[:phone_number],
        from: ENV['TWILIO_PHONE_NUMBER'],
        body: "Your One-Time Password (OTP) is #{otp}. This code is valid for the next 3 minutes."
      )
    render json: { message: "OTP sent successfully : #{otp}" }
    rescue Twilio::REST::TwilioError => e
      render json: { error: e.message }, status: :bad_request
    end
  end

  def validate_otp
    entered_otp = params[:entered_otp]
    # Retrieve the expected OTP from the session or database
    current_user = User.find_by_phone_number(params[:phone_number])
    stored_otp = current_user.otp_secret

    if entered_otp == '123456' && (stored_otp && stored_otp == entered_otp && !current_user.otp_expired?)
      # OTP is valid; you can proceed with the user's requested action
      sign_in(current_user)
      render json: { message: 'OTP is valid'}
    else
      # OTP is invalid; you can handle the error accordingly
      render json: { error: 'Invalid OTP' }, status: :bad_request
    end
  end

  private

  def send_params
    params.require(:phone_number)
  rescue ActionController::ParameterMissing => e
    render json: { error: "Missing parameter: #{e.param}" }, status: :bad_request
  end

  def validate_params
    params.require(:phone_number)
    params.require(:entered_otp)
  rescue ActionController::ParameterMissing => e
    render json: { error: "Missing parameter: #{e.param}" }, status: :bad_request
  end
end
