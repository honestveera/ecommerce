class Api::V1::WishListsController < ApplicationController
  before_action :authenticate_user!
  skip_before_action :verify_authenticity_token
  include PaginationHelper
  before_action :set_user, only: [:index, :create, :show, :destroy]

def index
  if @user
    @wish_lists = @user.wish_lists.includes(:book)
    if @wish_lists.any?
      render json: { wish_list_items: ActiveModelSerializers::SerializableResource.new(@wish_lists, each_serializer: Api::V1::WishListSerializer), code: 200, message: 'Wish list items fetched successfully' }, status: :ok
    else
      render json: { code: 422, message: 'no wish list found for this user' }, status: :unprocessable_entity
    end
  else
    render json: { message: 'User not found' }, status: :not_found
  end
end

def show
  @wish_list = @user.wish_lists.find_by(book_id: params[:id])

  if @wish_list
    render json: { wish_list_item: Api::V1::WishListSerializer.new(@wish_list), code: 200, message: 'Wish list item fetched successfully' }, status: :ok
  else
    render json: { code: 404, message: 'Wish list item not found' }, status: :not_found
  end
end

def create
  @book = Book.find_by(id: params[:book_id])

  if @book
    if @user.wish_lists.exists?(book_id: @book.id)
      render json: { message: 'Book is already in the wish list', code: 422 }, status: :unprocessable_entity
    else
      @wish_list = @user.wish_lists.new(book: @book)

      if @wish_list.save
        render json: { wish_list_item: Api::V1::WishListSerializer.new(@wish_list), code: 201, message: 'Wish list item created successfully' }, status: :created
      else
        render json: { errors: @wish_list.errors.full_messages, message: 'Failed to create wish list item' }, status: :unprocessable_entity
      end
    end
  else
    render json: { message: 'Book not found', code: 404 }, status: :not_found
  end
end

 def destroy
   @wish_list = @user.wish_lists.find_by(book_id: params[:id])

   if @wish_list
      @wish_list.destroy
      render json: { code: 200, message: 'wish list deleted successfully' }, status: :ok
    else
      render json: { code: 404, message: 'Wish list item not found' }, status: :not_found
    end
  end
  
  private

  def set_user
    @user = params[:user_id].present? ? User.find_by(id: params[:user_id]) : current_user
  
    unless @user
      render json: { code: 404, message: 'User not found' }, status: :not_found
    end
  end  
end