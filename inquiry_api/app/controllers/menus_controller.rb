class MenusController < ApplicationController
  def index
    @menus = Menu.published.order :created_at
    render json: menus_json, status: :ok
  end

  private

  def fields
    if params[:fields]
      params[:fields].split(',').map(&:to_sym)
    else
      [:name]
    end
  end

  def menus_json
    {
      data: @menus.select(*fields).map(&:attributes)
    }.to_json
  end
end
