# frozen_string_literal: true

module Types
  # Schema for User model
  class UserType < Types::BaseObject
    key fields: 'id'

    field :id, ID, null: false
    field :company_name, String, null: true
    field :name, String, null: false
    field :email, String, null: false
    field :tel, String, null: false
    field :address, AddressType, null: false
    def address
      object.address
    end

    field :created_at, Int, null: false
    def created_at
      object.created_at_unix
    end

    field :updated_at, Int, null: false
    def updated_at
      object.updated_at_unix
    end

    def self.resolve_reference(reference, _context)
      User.find reference[:id]
    end
  end
end
