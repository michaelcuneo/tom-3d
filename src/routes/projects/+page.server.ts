import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const projects = [
		{
			title: 'Urban Ambience',
			description: 'Capturing the raw sounds of the city in motion.',
			link: '/projects/urban-ambience',
			image: 'https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg'
		},
		{
			title: 'Forest Layers',
			description: 'An immersive nature-based recording project.',
			link: '/projects/forest-layers',
			image: 'https://images.pexels.com/photos/1098592/pexels-photo-1098592.jpeg'
		},
		{
			title: 'Studio FX Design',
			description: 'Experimental sound design in controlled spaces.',
			link: '/projects/studio-fx',
			image: 'https://images.pexels.com/photos/1649387/pexels-photo-1649387.jpeg'
		},
		{
			title: 'Water Echoes',
			description: 'Hydrophone recordings from lakes and rivers.',
			link: '/projects/water-echoes',
			image: 'https://images.pexels.com/photos/3552882/pexels-photo-3552882.jpeg'
		},
		{
			title: 'Mountain Winds',
			description: 'Field capture of alpine gusts and elevation tones.',
			link: '/projects/mountain-winds',
			image: 'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg'
		},
		{
			title: 'Industrial Rhythms',
			description: 'Mechanical and urban machinery percussion.',
			link: '/projects/industrial-rhythms',
			image: 'https://images.pexels.com/photos/209251/pexels-photo-209251.jpeg'
		},
		{
			title: 'Cave Reverbs',
			description: 'Sound reflections in underground chambers.',
			link: '/projects/cave-reverbs',
			image: 'https://images.pexels.com/photos/2251571/pexels-photo-2251571.jpeg'
		},
		{
			title: 'Fire & Ember',
			description: 'Crackling textures and heat shimmer ambiance.',
			link: '/projects/fire-ember',
			image: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg'
		},
		{
			title: 'Ghost Signals',
			description: 'Radio sweeps and lost transmissions.',
			link: '/projects/ghost-signals',
			image: 'https://images.pexels.com/photos/596132/pexels-photo-596132.jpeg'
		}
	];

	return {
		projects
	};
};
