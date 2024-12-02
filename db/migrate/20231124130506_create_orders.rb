class CreateOrders < ActiveRecord::Migration[7.0]
  def change
    create_table :orders do |t|
      t.string :order_number, limit: 255
      t.string :order_type, limit: 10
      t.date :date
      t.integer :book_id
      t.integer :corporate_id
      t.integer :user_id
      t.string :status, limit: 255
      t.integer :amount, limit: 8

      t.timestamps
    end
  end
end
