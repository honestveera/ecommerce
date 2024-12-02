class Api::V1::EnquirySerializer < ActiveModel::Serializer
  attributes :id, :name, :email, :created_at, :updated_at, :message, :mobile, :role, :employee_size, :company_name

end