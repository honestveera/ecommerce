class Api::V1::SubcategorySerializer < ActiveModel::Serializer
  attributes :id, :name, :category_id

  belongs_to :category
  
end
