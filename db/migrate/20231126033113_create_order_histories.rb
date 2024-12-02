class CreateOrderHistories < ActiveRecord::Migration[7.0]
  def change
    create_table :order_histories do |t|
      t.integer :order_id
      t.integer :delivery_user_id
      t.integer :order_user_id
      t.string :status

      t.timestamps
    end
  end
end
