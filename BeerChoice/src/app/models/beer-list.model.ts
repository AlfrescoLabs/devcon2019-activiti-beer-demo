/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an AS IS BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export class BeerList {
  found: string;
  limit: string;
  offset: string;
  term: string;
  parsedTerm: string;
  beers: Beer[] = [];

  constructor(obj: any) {
    this.found = obj.found;
    this.limit = obj.limit;
    this.offset = obj.offset;
    this.term = obj.term;
    this.parsedTerm = obj.parsed_term;
    if (obj.beers && obj.beers.items) {
      obj.beers.items.forEach(element => this.beers.push(new Beer(element)));
    }
  }
}

export class BeerEvent {
  action: string;
  value: Beer;

  constructor(obj: any) {
    this.action = obj.action;
    this.value = obj.value;
  }
}

export class Beer {
  bid: number;
  beer_name: string;
  beer_label: string;
  beer_abv: number;
  beer_ibu: number;
  beer_description: string;
  created_at: string;
  beer_style: string;
  auth_rating: number;
  wish_list: boolean;
  in_production: number;
  brewery: Brewery;

  constructor(obj: any) {
    this.bid = obj.beer.bid;
    this.beer_name = obj.beer.beer_name;
    this.beer_label = obj.beer.beer_label;
    this.beer_abv = obj.beer.beer_abv;
    this.beer_ibu = obj.beer.beer_ibu;
    this.beer_description = obj.beer.beer_description ? obj.beer.beer_description : 'No Description Provided';
    this.created_at = obj.beer.created_at;
    this.beer_style = obj.beer.beer_style;
    this.auth_rating = obj.beer.auth_rating;
    this.wish_list = obj.beer.wish_list;
    this.in_production = obj.beer.in_production;
    this.brewery = new Brewery(obj.brewery);
  }
}

export class Brewery {
  brewery_id: number;
  brewery_name: string;
  brewery_slug: string;
  brewery_label: string;
  country_name: string;
  brewery_active: number;
  contact: BreweryContact;
  location: BreweryLocation;

  constructor(obj: any) {
    this.brewery_id = obj.brewery_id;
    this.brewery_name = obj.brewery_name;
    this.brewery_slug = obj.brewery_slug;
    this.brewery_label = obj.brewery_label;
    this.country_name = obj.country_name;
    this.brewery_active = obj.brewery_active;
    this.contact = new BreweryContact(obj.contact);
    this.location = new BreweryLocation(obj.location);
  }
}

export class BreweryLocation {
  brewery_city: string;
  brewery_state: string;
  lat: string;
  lng: string;

  constructor(obj: any) {
    this.brewery_city = obj.brewery_city;
    this.brewery_state = obj.brewery_state;
    this.lat = obj.lat;
    this.lng = obj.lng;
  }
}

export class BreweryContact {
  twitter: string;
  facebook: string;
  instagram: string;
  url: string;

  constructor(obj: any) {
    this.twitter = obj.twitter;
    this.facebook = obj.facebook;
    this.instagram = obj.instagram;
    this.url = obj.url;
  }
}
