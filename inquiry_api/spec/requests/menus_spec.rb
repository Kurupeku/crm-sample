require 'rails_helper'

RSpec.describe 'Menus', type: :request do
  describe 'GET /index' do
    before do
      create_list :menu, 4
      create_list :menu, 5, published_on: Date.current
    end

    it 'status: 200 (:ok) で scope: :published のレコードのみが取得できる' do
      get '/menus', headers: json_headers
      expect(response).to have_http_status(:ok)
      is_asserted_by { parse_body(response).fetch(:data).size == 5 }
    end

    it 'params[:fields] に欲しいカラムをカンマ区切りで渡した場合、そのカラムのみが返ってくる' do
      keys = %i[id published_on].sort
      get '/menus', headers: json_headers, params: { fields: keys.map(&:to_s).join(',') }
      first_data = parse_body(response).fetch(:data).first
      is_asserted_by { first_data.keys.sort == keys }
    end
  end
end
