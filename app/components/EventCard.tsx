              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  // Add to calendar functionality
                }}
                className="flex items-center gap-2 px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-900 hover:text-white transition-all duration-300 border-2 border-gray-900"
              >
                <Calendar className="h-4 w-4" />
                <span>Add to Calendar</span>
              </button> 