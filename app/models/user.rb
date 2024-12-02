class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  include Devise::JWT::RevocationStrategies::JTIMatcher

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :timeoutable,
         :jwt_authenticatable, jwt_revocation_strategy: self

  has_many :user_roles
  has_many :roles, through: :user_roles

  belongs_to :corporate
  has_many :books, dependent: :destroy
  has_many :orders, dependent: :destroy
  has_one :cart
  has_many :wish_lists , dependent: :destroy
  
  def on_jwt_dispatch(token, payload)
    puts "Token : #{token} Payload: #{payload}"
  end

  def approved_user?
    admin_flag = roles.exists?(name: ['SuperAdmin', 'Admin', 'DeliveryPartner'])
    return true if admin_flag
  
    employee_flag = roles.exists?(name: ['Employee'])
    employee_flag && corporate_approval_flag
  end

  def self.retrive_users(hash)
    if hash[:role] == 'DeliveryPartner' && hash[:corporate_id]
      Role.find_by_name(hash[:role])&.users&.select { |user| user.corporate_id == hash[:corporate_id] }
    elsif hash[:corporate_id] && hash[:corporate_flag]
      User.where(corporate_approval_flag: hash[:corporate_flag], corporate_id: hash[:corporate_id])
    elsif hash[:role] == 'DeliveryPartner'
      Role.find_by_name(hash[:role])&.users
    elsif hash[:corporate_id]
      Corporate.find(hash[:corporate_id])&.users
    elsif hash[:corporate_flag]
      User.where(corporate_approval_flag: hash[:corporate_flag])
    else
      User.all
    end
  end

  def create_cart
    Cart.create(user: self)
  end

  def otp_expired?
    return false if otp_sent_at.blank?

    expiration_time = 180.seconds
    (Time.now - otp_sent_at) > expiration_time
  end
end
