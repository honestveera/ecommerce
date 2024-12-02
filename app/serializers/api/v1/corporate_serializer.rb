class Api::V1::CorporateSerializer < ActiveModel::Serializer
  attributes :id, :name, :subscription_date, :address, :validity, :active

  def active
    object.active ? 'ACTIVE' : 'INACTIVE'
  end
end
