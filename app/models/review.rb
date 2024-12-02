class Review < ApplicationRecord
  belongs_to :book
  belongs_to :user

  after_save :calculate_overall_rating

  private

  def calculate_overall_rating
    book.calculate_overall_rating
  end
end
