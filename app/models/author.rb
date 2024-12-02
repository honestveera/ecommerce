class Author < ApplicationRecord
    has_many :books, dependent: :destroy
    has_one_attached :image

  def image_url
    Rails.application.routes.url_helpers.url_for(image) if image.attached?
  end

  def as_json(options = {})
    super(options.merge(except: [:created_at, :updated_at]))
  end
end
