import cheerio from 'cheerio';

const url = 'https://sfmvdm.appfolio.com/listings';

const res = await fetch(url);

const domain = url.match(/^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/?\n]+)/gim)[0];

const html = await res.text();

const $ = cheerio.load(html);

const cleanNumber = (str) => Number(str.replace(/[^0-9.-]+/g, ''));

const listings = [];
$('.listing-item').each((i, el) => {
	const listing = {};
	listing.address = $(el).find('.js-listing-address').text();
	listing.maxTenants = parseInt(
		$(el)
			.find('.js-listing-description')
			.text()
			.matchAll(/(\d+) (Person|Tenant)/gi)
			.next().value[1]
	);
	listing.detailsUrl = domain + $(el).find('.js-link-to-detail').attr('href');
	const detailBoxes = $(el).find('.detail-box__item');
	detailBoxes.each((i, el) => {
		const label = $(el).find('.detail-box__label').text();
		const value = $(el).find('.detail-box__value').text();
		switch (label) {
			case 'RENT':
				listing.monthlyRent = cleanNumber(value);
				break;
			case 'Bed / Bath':
				const [bedrooms, bathrooms] = value.split('/');
				listing.bedrooms = cleanNumber(bedrooms);
				listing.bathrooms = cleanNumber(bathrooms);
				if (bedrooms.trim() === 'Studio') {
					listing.type = 'studio';
					listing.bedrooms = 1;
				} else {
					listing.type = 'apartment';
				}
				break;
			case 'Square Feet':
				listing.squareFeet = cleanNumber(value);
				break;
			case 'Available':
				listing.availabilityDate = new Date(value);
				break;
			default:
				console.log('Unknown', label, value);
		}
	});
	listings.push(listing);
});
await Promise.all(
	listings.map(async (listing) => {
		const res = await fetch(listing.detailsUrl);
		const html = await res.text();
		const $ = cheerio.load(html);
		listing.images = [
			...new Set(
				$('img')
					.map((i, el) => $(el).attr('src'))
					.get()
			)
		]
			.filter((url) => !url.includes('thumbnail'))
			.map((url) => url.replace('medium.jpg', 'large.jpg'));
	})
);
console.log(listings);
