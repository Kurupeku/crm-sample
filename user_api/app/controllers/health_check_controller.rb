class HealthCheckController < ApplicationController
  def index
    render json: { status: 200, result: 'success' }.to_json, status: :ok
  end
end
