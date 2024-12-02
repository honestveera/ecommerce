class Api::V1::UserSerializer < ActiveModel::Serializer
    attributes :id, :first_name, :last_name, :email, :phone_number, :country, :gender, :age, :corporate_id, :company_name, :corporate_approval_flag, :role
  
    # Add a method to get the company_name
    def company_name
      object.corporate.name if object.corporate
    end

    def role
      object.roles&.first&.name
    end
  end