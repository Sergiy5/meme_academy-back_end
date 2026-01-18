import { MemeCard } from '../types';

// Collection of popular reaction meme images
// Using reliable CDN-hosted meme images
export const MEME_POOL: MemeCard[] = [
  // Surprised/Shocked reactions
  { id: 'm001', imageUrl: 'https://imgflip.com/s/meme/Distracted-Boyfriend.jpg' },
  { id: 'm002', imageUrl: 'https://imgflip.com/s/meme/Woman-Yelling-At-Cat.jpg' },
  { id: 'm003', imageUrl: 'https://imgflip.com/s/meme/Mocking-Spongebob.jpg' },
  { id: 'm004', imageUrl: 'https://imgflip.com/s/meme/One-Does-Not-Simply.jpg' },
  { id: 'm005', imageUrl: 'https://imgflip.com/s/meme/X-X-Everywhere.jpg' },
  { id: 'm006', imageUrl: 'https://imgflip.com/s/meme/Ancient-Aliens.jpg' },
  { id: 'm007', imageUrl: 'https://imgflip.com/s/meme/Disaster-Girl.jpg' },
  { id: 'm008', imageUrl: 'https://imgflip.com/s/meme/Change-My-Mind.jpg' },
  { id: 'm009', imageUrl: 'https://imgflip.com/s/meme/Surprised-Pikachu.jpg' },
  { id: 'm010', imageUrl: 'https://imgflip.com/s/meme/Two-Buttons.jpg' },

  // Approval/Disapproval
  { id: 'm011', imageUrl: 'https://imgflip.com/s/meme/Drake-Hotline-Bling.jpg' },
  { id: 'm012', imageUrl: 'https://imgflip.com/s/meme/Grus-Plan.jpg' },
  { id: 'm013', imageUrl: 'https://imgflip.com/s/meme/Sad-Pablo-Escobar.jpg' },
  { id: 'm014', imageUrl: 'https://imgflip.com/s/meme/UNO-Draw-25-Cards.jpg' },
  { id: 'm015', imageUrl: 'https://imgflip.com/s/meme/Y-U-No.jpg' },
  { id: 'm016', imageUrl: 'https://imgflip.com/s/meme/Always-Has-Been.png' },
  { id: 'm017', imageUrl: 'https://imgflip.com/s/meme/Confession-Bear.jpg' },
  { id: 'm018', imageUrl: 'https://imgflip.com/s/meme/This-Is-Fine.jpg' },
  { id: 'm019', imageUrl: 'https://imgflip.com/s/meme/Is-This-A-Pigeon.jpg' },
  { id: 'm020', imageUrl: 'https://imgflip.com/s/meme/Expanding-Brain.jpg' },

  // Emotional reactions
  { id: 'm021', imageUrl: 'https://imgflip.com/s/meme/Clown-Applying-Makeup.jpg' },
  { id: 'm022', imageUrl: 'https://imgflip.com/s/meme/Grumpy-Cat.jpg' },
  { id: 'm023', imageUrl: 'https://imgflip.com/s/meme/Inhaling-Seagull.jpg' },
  { id: 'm024', imageUrl: 'https://imgflip.com/s/meme/Panik-Kalm-Panik.png' },
  { id: 'm025', imageUrl: 'https://imgflip.com/s/meme/I-Bet-Hes-Thinking-About-Other-Women.jpg' },
  { id: 'm026', imageUrl: 'https://imgflip.com/s/meme/Waiting-Skeleton.jpg' },
  { id: 'm027', imageUrl: 'https://imgflip.com/s/meme/Doge.jpg' },
  { id: 'm028', imageUrl: 'https://imgflip.com/s/meme/Evil-Kermit.jpg' },
  { id: 'm029', imageUrl: 'https://imgflip.com/s/meme/Boardroom-Meeting-Suggestion.jpg' },
  { id: 'm030', imageUrl: 'https://imgflip.com/s/meme/Bike-Fall.jpg' },

  // Thinking/Confused
  { id: 'm031', imageUrl: 'https://imgflip.com/s/meme/Philosoraptor.jpg' },
  { id: 'm032', imageUrl: 'https://imgflip.com/s/meme/Star-Wars-Yoda.jpg' },
  { id: 'm033', imageUrl: 'https://imgflip.com/s/meme/Bad-Luck-Brian.jpg' },
  { id: 'm034', imageUrl: 'https://imgflip.com/s/meme/Awkward-Moment-Sealion.jpg' },
  { id: 'm035', imageUrl: 'https://imgflip.com/s/meme/Matrix-Morpheus.jpg' },
  { id: 'm036', imageUrl: 'https://imgflip.com/s/meme/Roll-Safe-Think-About-It.jpg' },
  { id: 'm037', imageUrl: 'https://imgflip.com/s/meme/Hide-the-Pain-Harold.jpg' },
  { id: 'm038', imageUrl: 'https://imgflip.com/s/meme/Mugatu-So-Hot-Right-Now.jpg' },
  { id: 'm039', imageUrl: 'https://imgflip.com/s/meme/Arthur-Fist.jpg' },
  { id: 'm040', imageUrl: 'https://imgflip.com/s/meme/Left-Exit-12-Off-Ramp.jpg' },

  // Success/Failure
  { id: 'm041', imageUrl: 'https://imgflip.com/s/meme/Success-Kid.jpg' },
  { id: 'm042', imageUrl: 'https://imgflip.com/s/meme/First-World-Problems.jpg' },
  { id: 'm043', imageUrl: 'https://imgflip.com/s/meme/Leonardo-Dicaprio-Cheers.jpg' },
  { id: 'm044', imageUrl: 'https://imgflip.com/s/meme/Epic-Handshake.jpg' },
  { id: 'm045', imageUrl: 'https://imgflip.com/s/meme/Captain-Picard-Facepalm.jpg' },
  { id: 'm046', imageUrl: 'https://imgflip.com/s/meme/Batman-Slapping-Robin.jpg' },
  { id: 'm047', imageUrl: 'https://imgflip.com/s/meme/Yall-Got-Any-More-Of-That.jpg' },
  { id: 'm048', imageUrl: 'https://imgflip.com/s/meme/Running-Away-Balloon.jpg' },
  { id: 'm049', imageUrl: 'https://imgflip.com/s/meme/Picard-Wtf.jpg' },
  { id: 'm050', imageUrl: 'https://imgflip.com/s/meme/Jack-Sparrow-Being-Chased.jpg' },

  // Animals
  { id: 'm051', imageUrl: 'https://imgflip.com/s/meme/Bernie-I-Am-Once-Again-Asking-For-Your-Support.jpg' },
  { id: 'm052', imageUrl: 'https://imgflip.com/s/meme/Buff-Doge-vs-Cheems.png' },
  { id: 'm053', imageUrl: 'https://imgflip.com/s/meme/Tuxedo-Winnie-The-Pooh.png' },
  { id: 'm054', imageUrl: 'https://imgflip.com/s/meme/Bad-Pun-Dog.jpg' },
  { id: 'm055', imageUrl: 'https://imgflip.com/s/meme/Marked-Safe-From.jpg' },
  { id: 'm056', imageUrl: 'https://imgflip.com/s/meme/Monkey-Puppet.jpg' },
  { id: 'm057', imageUrl: 'https://imgflip.com/s/meme/Theyre-The-Same-Picture.jpg' },
  { id: 'm058', imageUrl: 'https://imgflip.com/s/meme/Sad-Cat.jpg' },
  { id: 'm059', imageUrl: 'https://imgflip.com/s/meme/Socially-Awkward-Penguin.jpg' },
  { id: 'm060', imageUrl: 'https://imgflip.com/s/meme/Courage-Wolf.jpg' },

  // Classic/Vintage
  { id: 'm061', imageUrl: 'https://imgflip.com/s/meme/Finding-Neverland.jpg' },
  { id: 'm062', imageUrl: 'https://imgflip.com/s/meme/Me-And-The-Boys.jpg' },
  { id: 'm063', imageUrl: 'https://imgflip.com/s/meme/Third-World-Skeptical-Kid.jpg' },
  { id: 'm064', imageUrl: 'https://imgflip.com/s/meme/Overly-Attached-Girlfriend.jpg' },
  { id: 'm065', imageUrl: 'https://imgflip.com/s/meme/Unpopular-Opinion-Puffin.jpg' },
  { id: 'm066', imageUrl: 'https://imgflip.com/s/meme/Good-Fellas-Hilarious.jpg' },
  { id: 'm067', imageUrl: 'https://imgflip.com/s/meme/Scared-Cat.jpg' },
  { id: 'm068', imageUrl: 'https://imgflip.com/s/meme/Back-In-My-Day.jpg' },
  { id: 'm069', imageUrl: 'https://imgflip.com/s/meme/The-Rock-Driving.jpg' },
  { id: 'm070', imageUrl: 'https://imgflip.com/s/meme/Bitch-Please.jpg' },

  // Modern memes
  { id: 'm071', imageUrl: 'https://imgflip.com/s/meme/This-Is-Where-Id-Put-My-Trophy-If-I-Had-One.jpg' },
  { id: 'm072', imageUrl: 'https://imgflip.com/s/meme/Imagination-Spongebob.jpg' },
  { id: 'm073', imageUrl: 'https://imgflip.com/s/meme/Advice-Dog.jpg' },
  { id: 'm074', imageUrl: 'https://imgflip.com/s/meme/Insanity-Wolf.jpg' },
  { id: 'm075', imageUrl: 'https://imgflip.com/s/meme/Business-Cat.jpg' },
  { id: 'm076', imageUrl: 'https://imgflip.com/s/meme/Paranoid-Parrot.jpg' },
  { id: 'm077', imageUrl: 'https://imgflip.com/s/meme/Foul-Bachelor-Frog.jpg' },
  { id: 'm078', imageUrl: 'https://imgflip.com/s/meme/Sleeping-Shaq.jpg' },
  { id: 'm079', imageUrl: 'https://imgflip.com/s/meme/Chemistry-Cat.jpg' },
  { id: 'm080', imageUrl: 'https://imgflip.com/s/meme/Actual-Advice-Mallard.jpg' },

  // Extra variety
  { id: 'm081', imageUrl: 'https://imgflip.com/s/meme/College-Liberal.jpg' },
  { id: 'm082', imageUrl: 'https://imgflip.com/s/meme/NPC.jpg' },
  { id: 'm083', imageUrl: 'https://imgflip.com/s/meme/Lazy-College-Senior.jpg' },
  { id: 'm084', imageUrl: 'https://imgflip.com/s/meme/Face-You-Make-Robert-Downey-Jr.jpg' },
  { id: 'm085', imageUrl: 'https://imgflip.com/s/meme/Uncle-Sam.jpg' },
  { id: 'm086', imageUrl: 'https://imgflip.com/s/meme/PPAP.jpg' },
  { id: 'm087', imageUrl: 'https://imgflip.com/s/meme/Satisfied-Seal.jpg' },
  { id: 'm088', imageUrl: 'https://imgflip.com/s/meme/I-See-Dead-People.jpg' },
  { id: 'm089', imageUrl: 'https://imgflip.com/s/meme/Smiling-Cat.jpg' },
  { id: 'm090', imageUrl: 'https://imgflip.com/s/meme/Squidward.jpg' },

  // Final batch
  { id: 'm091', imageUrl: 'https://imgflip.com/s/meme/Afraid-To-Ask-Andy.jpg' },
  { id: 'm092', imageUrl: 'https://imgflip.com/s/meme/Heres-Johnny.jpg' },
  { id: 'm093', imageUrl: 'https://imgflip.com/s/meme/Cute-Cat.jpg' },
  { id: 'm094', imageUrl: 'https://imgflip.com/s/meme/X-All-The-Y.jpg' },
  { id: 'm095', imageUrl: 'https://imgflip.com/s/meme/Grus-Plan.jpg' },
  { id: 'm096', imageUrl: 'https://imgflip.com/s/meme/Futurama-Fry.jpg' },
  { id: 'm097', imageUrl: 'https://i.imgflip.com/eqbk9.jpg' },//fox
  { id: 'm098', imageUrl: 'https://i.imgflip.com/46hhvr.jpg' }, //mother
  { id: 'm099', imageUrl: 'https://imgflip.com/s/meme/Oprah-You-Get-A.jpg' },
  { id: 'm100', imageUrl: 'https://imgflip.com/s/meme/Forever-Alone.jpg' }
];


export function getRandomMemes(count: number, exclude: string[] = []): MemeCard[] {
  const available = MEME_POOL.filter(m => !exclude.includes(m.id));
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getMemeById(id: string): MemeCard | undefined {
  return MEME_POOL.find(m => m.id === id);
}
