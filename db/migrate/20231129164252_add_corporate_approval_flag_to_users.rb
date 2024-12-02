class AddCorporateApprovalFlagToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :corporate_approval_flag, :boolean, default: false
  end
end
