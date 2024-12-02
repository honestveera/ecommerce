class CreateWishLists < ActiveRecord::Migration[7.0]
  def change
    create_table :wish_lists do |t|
      t.integer :user_id
      t.integer :book_id

      t.timestamps
    end
    add_index("wish_lists","user_id")
    add_index("wish_lists","book_id")
    
  end
end