# frozen_string_literal: true

module Mutations
  # Mutation for Createing user
  class CreateUser < BaseMutation
    class CreateAddressInput < Types::BaseInputObject
      argument :postal_code, String, required: true
      argument :prefecture, String, required: true
      argument :city, String, required: true
      argument :street, String, required: true
      argument :building, String, required: false
    end

    argument :company_name, String, required: false
    argument :name, String, required: true
    argument :email, String, required: true
    argument :tel, String, required: true
    argument :address, CreateAddressInput, required: true

    type Types::UserType

    def resolve(**args)
      user = User.new user_params(args)
      user.build_address address_params(args[:address]) if args[:address].present?
      user.save! && user
    end

    private

    def user_params(args)
      args.reject do |key, _|
        key == :address
      end
    end

    def address_params(address)
      %i[postal_code prefecture city street building].map do |key|
        [key, address.send(key)]
      end.to_h
    end
  end
end
