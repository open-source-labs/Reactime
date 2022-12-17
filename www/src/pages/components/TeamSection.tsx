import Image from 'next/image'
import { useState } from 'react';

const people: string[][] = [
    ["Alex Gomez", "alexgomez9"],
    ["Alexander Landeros", "AlexanderLanderos"],
    ["Ali Rahman", "CourageWolf"],
    ["Andy Tsou", "andytsou19"],
    ["Andy Wong", "andywongdev"],
    ["Becca Viner", "rtviner"],
    ["Ben Michareune", "bmichare"],
    ["Brian Yang", "yangbrian310"],
    ["Bryan Lee", "mylee1995"],
    ["Caitlin Chan", "caitlinchan23"],
    ["Caner Demir", "demircaner"],
    ["Carlos Perez", "crperezt"],
    ["Chris Flannery", "chriswillsflannery"],
    ["Chris Guizzetti", "guizzettic"],
    ["Chris LeBrett", "fscgolden"],
    ["Christina Or", "christinaor"],
    ["Cole Styr", "c-styr"],
    ["Daljit Gill", "dgill05"],
    ["Dane Corpion", "danecorpion"],
    ["David Bernstein", "dangitbobbeh"],
    ["David Chai", "davidchai717"],
    ["David Kim", "codejunkie7"],
    ["Dennis Lopez", "DennisLpz"],
    ["Edar Liu", "liuedar"],
    ["Edwin Menendez", "edwinjmenendez"],
    ["Emin Tahirov", "eminthrv"],
    ["Ergi Shehu", "Ergi516"],
    ["Feiyi Wu", "FreyaWu"],
    ["Gabriela Aquino", "aquinojardim"],
    ["Greg Panciera", "gpanciera"],
    ["Haejin Jo", "haejinjo"],
    ["Harry Fox", "StackOverFlowWhereArtThou"],
    ["Hien Nguyen", "hienqn"],
    ["Jack Crish", "JackC27"],
    ["Jason Victor", "Theqwertypusher"],
    ["Joshua Howard", "Joshua-Howard"],
    ["Joseph Park", "joeepark"],
    ["Joseph Stern", "josephiswhere"],
    ["Josh Kim", "joshua0308"],
    ["Kevin Fey", "kevinfey"],
    ["Kevin HoEun Lee", "khobread"],
    ["Kevin Ngo", "kevin-ngo"],
    ["Khanh Bui", "AndyB909"],
    ["Kim Mai Nguyen", "Nkmai"],
    ["Kris Sorensen", "kris-sorensen"],
    ["Kristina Wallen", "kristinawallen"],
    ["Lina Shin", "rxlina"],
    ["Louis Lam", "llam722"],
    ["Nate Wa Mwenze", "nmwenz90"],
    ["Nathan Richardson", "BagelEnthusiast"],
    ["Ozair Ghulam", "OzairGh"],
    ["Peng Dong", "d28601581"],
    ["Prasanna Malla", "prasmalla"],
    ["Quan Le", "blachfog"],
    ["Rajeeb Banstola", "rajeebthegreat"],
    ["Raymond Kwan", "rkwn"],
    ["Robby Tipton", "RobbyTipton"],
    ["Robert Maeda", "robmaeda"],
    ["Rocky Lin", "rocky9413"],
    ["Ruth Anam", "peachiecodes"],
    ["Ryan Dang", "rydang"],
    ["Samuel Tran", "LeumasTr"],
    ["Sanjay Lavingia", "sanjaylavingia"],
    ["Sierra Swaby", "starkspark"],
    ["Tania Lind", "lind-tania"],
    ["Viet Nguyen", "vnguyen95"],
    ["Vincent Nguyen", "VNguyenCode"],
    ["Yujin Kang", " yujinkay"],
]

function replace(e: React.SyntheticEvent<HTMLImageElement>): void{
    console.log('test');
    e.currentTarget.onerror = null;
    e.currentTarget.src = "/profileFallback.png"
}

  export default function People(): JSX.Element {
    return (
      <div className="bg-white">
        <div className="mx-auto py-12 px-4 text-center sm:px-6 lg:px-8 lg:py-24">
          <div className="space-y-8 sm:space-y-12">
            <div className="space-y-5 sm:mx-auto sm:max-w-xl sm:space-y-4 lg:max-w-5xl">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Our Contributors</h2>
              <p className="text-xl text-gray-500">
                All of the people who make Reactime awesome!
              </p>
            </div>
            <ul
              role="list"
              className="mx-auto grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-4 md:gap-x-6 lg:max-w-5xl lg:gap-x-8 lg:gap-y-12 xl:grid-cols-8"
            >
              <>
                {people.map((person)=>(
                  <Profile key={person[1]} profile={person[1]} name={person[0]}/>
                ))}
              </>
            </ul>
          </div>
        </div>
      </div>
    )
  }
  type profileType = {
    profile: string | undefined,
    name: string | undefined,
  }
  function Profile({profile, name}: profileType) {
    const [imageError, setImageError] = useState(false);
    return (
      <div className="space-y-4">
        <Image
              width={100}
              height={100}
              src={imageError ? "/profileFallback.png" : 'https://github.com/' + profile + '.png'}
              className="mx-auto h-20 w-20 rounded-full lg:h-24 lg:w-24"
              onError={(e) => setImageError(true)}
              alt="missing-profile-image"
          />
        <div className="space-y-2">
          <div className="text-xs font-medium lg:text-sm">
            <h3>{name}</h3>
            <a target="_blank" href={`https://github.com/${profile}`} className="text-rose-500">{profile}</a>
          </div>
        </div>
      </div>
    )
}



