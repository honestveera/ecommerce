# config/initializers/pagy.rb
require 'pagy'
require 'pagy/extras/array' # Include this if you want to paginate arrays

Pagy::DEFAULT[:items] = 10000000
