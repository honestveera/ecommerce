class Api::V1::CartsController < ApplicationController
  before_action :authenticate_user!
  skip_before_action :verify_authenticity_token
  before_action :find_cart, only: %i[show add_to_cart destroy]

  def index
    @cart = current_user.cart

    if @cart
      book_details = @cart.cart_items.map do |cart_item|
        {
          book_id: cart_item.book.id,
          name: cart_item.book.name,
          price: cart_item.book.amount,
          overall_rating: cart_item.book.overall_rating,
          image_name: cart_item.book.image_name,
          author: {
            id: cart_item.book.author.id,
            name: cart_item.book.author.name
          },
          quantity: cart_item.quantity
        }
      end

      total_price = @cart.cart_items.sum { |cart_item| cart_item.book.amount * cart_item.quantity }

      render json: { id: @cart.id, book_details: book_details, total_price: total_price }, status: :ok
    else
      render json: { message: 'Cart not found' }, status: :not_found
    end
  end

  def show
    render json: @cart, include: :cart_items
  end

  def create
  if current_user.cart.blank?
    @cart = Cart.create(user: current_user)
  else 
    @cart = current_user.cart
  end

  book = Book.find(params[:book_id])
  quantity = params[:quantity].to_i

  if @cart
    cart_item = @cart.cart_items.find_or_initialize_by(book: book)
    cart_item.quantity = quantity  # Set the quantity directly

    if cart_item.save
      render json: { cart_item: cart_item, code: 200, message: 'Item added to cart successfully' }, status: :created
    else
      render json: { code: 400, errors: cart_item.errors.full_messages, message: 'Failed to add item to cart' }, status: :bad_request
    end
  else
    render json: { message: 'Cart not found' }, status: :not_found
  end
end

  def destroy_book
    find_cart
    book_id = params[:book_id]
    
    unless @cart
      render json: { message: 'Cart not found' }, status: :not_found
      return
    end

    Rails.logger.debug("Cart ID: #{@cart.id}")

    cart_item = @cart.cart_items.find_by(book_id: book_id)

    unless cart_item
      render json: { message: 'CartItem not found' }, status: :not_found
      return
    end

    Rails.logger.debug("CartItem ID: #{cart_item.id}")

    if cart_item.destroy
      render json: { code: 200, message: 'Book removed from cart successfully' }, status: :ok
    else
      render json: { code: 500, message: 'Failed to remove book from cart' }, status: :internal_server_error
    end
  end

  private

  def find_cart
    @cart = Cart.find_by(user_id: current_user.id)
    
    unless @cart
      render json: { message: 'Cart not found' }, status: :not_found
    end
  end
end
