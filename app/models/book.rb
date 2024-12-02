class Book < ApplicationRecord
  belongs_to :category
  belongs_to :subcategory
  belongs_to :author
  belongs_to :publisher
  belongs_to :user
  has_one_attached :image
  has_many :reviews

  def self.retreive_books(hash)
    hash[:availability] ? Book.where(availability: hash[:availability]) : Book.all
  end

  def image_url
    Rails.application.routes.url_helpers.url_for(image) if image.attached?
  end

  def calculate_overall_rating
    update(overall_rating: reviews.average(:rating).to_f)
  end
end
