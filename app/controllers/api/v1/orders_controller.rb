class Api::V1::OrdersController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :authenticate_user!
  
  include PaginationHelper
  include OrdersHelper

  before_action :set_order, only: %i[show update destroy]

  def index
    @orders = Order.retreive_orders(params)   
    pagination_info = paginate_records(@orders)
    render_pagination pagination_info, Api::V1::OrderSerializer, code: 200, message: 'Enquiry Fetched Successfully'
  end

  def show
    render json: @order
  end

  def create
    @order = Order.new(order_params)
    if @order.save
      OrderMailer.order_placed_notification(@order).deliver_now
      send_rented_notification
      render json: @order, status: :created
    else
      render json: @order.errors, status: :unprocessable_entity
    end
  end

  def update
    if @order.update(order_params)
      render json: @order
    else
      render json: @order.errors, status: :unprocessable_entity
    end
  end

  def update_status
    @order = Order.find(params[:id])
    if @order.update!(status: params[:order][:status])
      OrderHistory.create(
        order_id: @order.id,
        delivery_user_id: params[:order][:user_id],
        order_user_id: @order.user_id,
        status: params[:order][:status]
      )
      # Send email notification
      OrderMailer.order_status_notification(@order).deliver_now
      render json: @order, serializer: Api::V1::OrderSerializer
    else
      render json: @order.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @order.destroy
    head :no_content
  end

  private

  def set_order
    @order = Order.find(params[:id])
  end

  def order_params
    params.require(:order).permit(:order_type, :date, :book_id, :corporate_id, :user_id,
                                  :status, :amount)
  end
end
