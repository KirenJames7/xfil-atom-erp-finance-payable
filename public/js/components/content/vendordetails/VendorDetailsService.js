/* 
 * Copyright (C) 2019 kirenj
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
import FinanceLobbyAPIURLService from '../apis/FinanceLobbyAPIURLService.js';

class VendorDetailsService {
    
    async getAllCountries() {
        
        return $.get({
            url: await new FinanceLobbyAPIURLService().getFinanceLobbyAPIURL().then((response) => { return response.url; }) + "/api/v1/countries"
        });
        
    }
    
    async getAllProvincesStates(country) {
        
        return $.get({
            url: await new FinanceLobbyAPIURLService().getFinanceLobbyAPIURL().then((response) => { return response.url; }) + "/api/v1/countryprovincesstates?country=" + country
        });
        
    }
    
    async getAllCities(province_state, country) {
        
        return $.get({
            url: await new FinanceLobbyAPIURLService().getFinanceLobbyAPIURL().then((response) => { return response.url; }) + "/api/v1/provincestatecities?province_state=" + province_state + "&country=" + country
        });
        
    }
    
    getContactTypes() {
        
        return $.get({
            url: "contacttypes"
        });
        
    }
    
    vendorCreation(formData) {
        
        return $.post({
            url: "vendorcreation",
            data: formData
        });
        
    }
    
}

export default VendorDetailsService;