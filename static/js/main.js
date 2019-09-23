function Search(e) {
    e.preventDefault();
    form = $('#search');

    $.ajax({
        url: 'search',
        type: 'post',
        dataType: 'json',
        data: form.serialize(),
        success: function (response) {
            console.log(response);
        },
        error: function (error) {
            console.log(error);
        }
    });
}

$(document).ready(function () {
    $.ajax({
        url: 'http://kickstarter-success.herokuapp.com/',
        type: 'post',
        data: {
            "name": "Test_Project_1",
            "category": '5',
            "blurb": "Put the decription here and bla bla bla.",
            "goal_usd": '100000',
            "campaign_duration_days": '30',
            "country": '3'
        },
        dataType: 'json',
        success: function (response) {
            console.log(response);
        },
        error: function (error) {
            console.log(error);
        }
    });

    country = $('#country');
    city = $('#city');
    city_search = $('#city_search');

    $.ajax({
        url: 'https://api.openaq.org/v1/countries',
        type: 'get',
        success: function (response) {
            console.log(response);
            country.append('<option disabled selected>Select Country</option>')
            response['results'].forEach(function(c) {
                country.append('<option value="'+c['code']+'">'+c['name']+'</option>')
            })
        },
        error: function (error) {
            console.log(error);
        }
    });

    country.on('change',function() {
        $('#city').empty();
        $('#city_search').show();

        $.ajax({
            url: 'https://api.openaq.org/v1/cities?country='+this.value,
            type: 'get',
            success: function (response) {
                console.log(response);
                city.append('<option disabled selected>Select City</option>')
                response['results'].forEach(function(city) {
                    $('#city').append('<option value="'+city['city']+'">'+city['city']+' ('+city['count']+' tests)</option>')
                })
            },
            error: function (error) {
                console.log(error);
            }
        });
    });

    city.on('change',function() {
        form = $('#search');
        data = {'country_name':country = document.getElementById('country').value,'city_name':this.value}
        $('#error').empty();
        $('.records').empty()

        $.ajax({
            url: 'search',
            type: 'post',
            dataType: 'json',
            data: data,
            success: function (response) {
                console.log(response);
                if(response['response'] == 0) {
                    $('#error').html(response['message'])
                }else {
                    $('.records').append('<h2>Air Pollution</h2>');
                    response['message'].forEach(function(result) {
                        date = new Date(result['date']['utc'])
                        $('.records').append('<p>' + result['value'] + ' ' + result['unit'] + ' on ' + (date.getMonth() + 1) + '/' + date.getDate()+'/'+date.getFullYear()+'</p>');
                    })
                }
            },
            error: function (error) {
                console.log(error);
            }
        });
    });
});