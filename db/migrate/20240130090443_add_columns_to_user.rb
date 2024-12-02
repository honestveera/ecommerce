class AddColumnsToUser < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :otp_secret, :string
    add_column :users, :phone_number, :string
    add_column :users, :otp_sent_at, :datetime
  end
end
