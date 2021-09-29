class InquiriesController < ApplicationController
  def create
    @inquiry = Inquiry.new inquiry_params
    if @inquiry.save
      render json: success_json, status: :created
    else
      render json: error_json, status: :unprocessable_entity
    end
  end

  private

  def inquiry_params
    params.require(:inquiry).permit(*inquiry_attribute_keys)
  end

  def inquiry_attribute_keys
    %i[
      company_name name email tel
      number_of_users introductory_term detail
    ]
  end

  def success_json
    { data: @inquiry.attributes }.to_json
  end

  def shaped_massages
    @inquiry.errors.messages.to_a.each_with_object([]) do |pair, result|
      key, msgs = pair
      msgs.each do |msg|
        result << { key: key, message: msg }
      end
      result
    end
  end

  def error_json
    { errors: shaped_massages }.to_json
  end
end
