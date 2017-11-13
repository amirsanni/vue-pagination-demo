/**
 * @author Amir Sanni <amirsanni@gmail.com>
 * @date 12th Nov, 2017
 */

'use strict';

window.addEventListener('load', function(){
	new Vue({
		el: "#countryCodes",
		
		data(){
			return {
				isLoading: true,
				allCountries: [],
				countriesToDisplay: [],
				perPage: 20,
				pageToOpen: 1,
				currentPage: 1
			};
		},

		created(){
			this.getCountries();
		},

		methods: {
			getCountries(){
				this.isLoading = true;//indicate that we're loading/fetching data

				let _this = this;

				$.ajax('https://1410inc.xyz/api/countrycodes.json', {
					method: "GET"
				}).done(function(rd){
					//put the values gotten in `allCountries`
					_this.allCountries = rd.countries;
					_this.isLoading = false;//no longer fetching

					//then render list on DOM
					_this.renderList();//re-renderlist on DOM
				}).fail(function(){
					console.log('unable to fetch countries');
				});
			},
			
			renderList(pageNumber=1){
				//clear currently displayed list
				this.countriesToDisplay = [];

				//set countries to display
				if(this.allCountries.length){
					let _this = this;

					return new Promise(function(res, rej){
						//set the page to open to the pageNumber in the parameter in order to allow start and stop to update accordingly
						_this.pageToOpen = pageNumber;

						//add the necessary data to `countriesToDisplay` array
						for(let i = _this.start; i <= _this.stop; i++){
							_this.countriesToDisplay.push(_this.allCountries[i]);
						}

						res();
					}).then(function(){
						//Now update the current page to the page we just loaded
						_this.currentPage = _this.pageToOpen;
					}).catch(function(){
						console.log('render err');
					});                  
				}
			}
		},

		computed: {
			totalPages(){
				//calculate the total number of pages based on the number of items to show per page and the total items we got from server
				return this.allCountries.length && (this.allCountries.length > this.perPage) ? Math.ceil(this.allCountries.length/this.perPage) : 1;
			},

			start(){
				return (this.pageToOpen - 1) * this.perPage;
			},

			stop(){
				//stop at the end of the array if array length OR the items left are less than the number of items to show per page
				//do the calculation if otherwise
				if((this.allCountries.length - this.start) >= this.perPage){
					return (this.pageToOpen * this.perPage) - 1;
				}

				else{
					return this.allCountries.length - 1;
				}
			},
			
			showNext(){
                return this.currentPage < this.totalPages;
            },
            
            showPrev(){
                return this.currentPage > 1;
            }
		},

		watch: {
			//re-render list based on the value of `perPage` which indicates how many to show per page
			perPage: function(){
				this.renderList();
			}
		}
	});
});