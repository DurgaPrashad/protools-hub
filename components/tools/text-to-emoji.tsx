"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Copy, RotateCcw, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

// Sample emoji mapping
const emojiMap: Record<string, string> = {
  // Common words
  "love": "❤️",
  "heart": "❤️",
  "happy": "😊",
  "sad": "😢",
  "laugh": "😂",
  "smile": "😊",
  "cry": "😭",
  "angry": "😠",
  "fire": "🔥",
  "hot": "🔥",
  "cool": "😎",
  "sun": "☀️",
  "moon": "🌙",
  "star": "⭐",
  "stars": "✨",
  "rain": "🌧️",
  "snow": "❄️",
  "cloud": "☁️",
  "clouds": "☁️",
  "tree": "🌳",
  "flower": "🌸",
  "flowers": "💐",
  "rose": "🌹",
  "dog": "🐶",
  "cat": "🐱",
  "bird": "🐦",
  "fish": "🐠",
  "monkey": "🐵",
  "lion": "🦁",
  "tiger": "🐯",
  "horse": "🐴",
  "cow": "🐮",
  "pig": "🐷",
  "mouse": "🐭",
  "rabbit": "🐰",
  "bear": "🐻",
  "panda": "🐼",
  "chicken": "🐔",
  "penguin": "🐧",
  "frog": "🐸",
  "snake": "🐍",
  "pizza": "🍕",
  "hamburger": "🍔",
  "burger": "🍔",
  "fries": "🍟",
  "hotdog": "🌭",
  "taco": "🌮",
  "burrito": "🌯",
  "sushi": "🍣",
  "noodles": "🍜",
  "pasta": "🍝",
  "bread": "🍞",
  "cheese": "🧀",
  "egg": "🥚",
  "eggs": "🥚",
  "bacon": "🥓",
  "cake": "🍰",
  "cookie": "🍪",
  "cookies": "🍪",
  "chocolate": "🍫",
  "candy": "🍬",
  "lollipop": "🍭",
  "ice cream": "🍦",
  "donut": "🍩",
  "coffee": "☕",
  "tea": "🍵",
  "milk": "🥛",
  "water": "💧",
  "beer": "🍺",
  "wine": "🍷",
  "cocktail": "🍸",
  "car": "🚗",
  "bus": "🚌",
  "train": "🚆",
  "airplane": "✈️",
  "plane": "✈️",
  "ship": "🚢",
  "boat": "⛵",
  "bicycle": "🚲",
  "bike": "🚲",
  "motorcycle": "🏍️",
  "rocket": "🚀",
  "house": "🏠",
  "home": "🏠",
  "building": "🏢",
  "school": "🏫",
  "hospital": "🏥",
  "hotel": "🏨",
  "castle": "🏰",
  "church": "⛪",
  "mosque": "🕌",
  "temple": "🛕",
  "stadium": "🏟️",
  "tent": "⛺",
  "bridge": "🌉",
  "fountain": "⛲",
  "mountain": "⛰️",
  "mountains": "🏔️",
  "beach": "🏖️",
  "desert": "🏜️",
  "island": "🏝️",
  "forest": "🌲",
  "books": "📚",
  "book": "📖",
  "notebook": "📓",
  "pencil": "✏️",
  "pen": "🖊️",
  "crayon": "🖍️",
  "paintbrush": "🖌️",
  "scissors": "✂️",
  "paperclip": "📎",
  "ruler": "📏",
  "briefcase": "💼",
  "backpack": "🎒",
  "purse": "👛",
  "handbag": "👜",
  "luggage": "🧳",
  "glasses": "👓",
  "sunglasses": "🕶️",
  "hat": "🧢",
  "crown": "👑",
  "ring": "💍",
  "necklace": "📿",
  "watch": "⌚",
  "clock": "🕰️",
  "gift": "🎁",
  "balloon": "🎈",
  "balloons": "🎈",
  "party": "🎉",
  "birthday": "🎂",
  "christmas": "🎄",
  "halloween": "🎃",
  "music": "🎵",
  "musical": "🎵",
  "guitar": "🎸",
  "piano": "🎹",
  "drum": "🥁",
  "drums": "🥁",
  "microphone": "🎤",
  "headphones": "🎧",
  "radio": "📻",
  "tv": "📺",
  "television": "📺",
  "camera": "📷",
  "video": "📹",
  "movie": "🎬",
  "film": "🎬",
  "cinema": "🎦",
  "theater": "🎭",
  "art": "🎨",
  "painting": "🖼️",
  "game": "🎮",
  "games": "🎮",
  "dice": "🎲",
  "chess": "♟️",
  "football": "⚽",
  "soccer": "⚽",
  "basketball": "🏀",
  "baseball": "⚾",
  "tennis": "🎾",
  "volleyball": "🏐",
  "rugby": "🏉",
  "golf": "⛳",
  "hockey": "🏒",
  "skiing": "⛷️",
  "snowboarding": "🏂",
  "surfing": "🏄",
  "swimming": "🏊",
  "cycling": "🚴",
  "running": "🏃",
  "walking": "🚶",
  "dancing": "💃",
  "dance": "💃",
  "yoga": "🧘",
  "medal": "🏅",
  "trophy": "🏆",
  "money": "💰",
  "dollar": "💵",
  "dollars": "💵",
  "euro": "💶",
  "euros": "💶",
  "credit card": "💳",
  "phone": "📱",
  "telephone": "☎️",
  "computer": "💻",
  "laptop": "💻",
  "keyboard": "⌨️",
  "mouse": "🖱️",
  "printer": "🖨️",
  "battery": "🔋",
  "plug": "🔌",
  "light": "💡",
  "bulb": "💡",
  "lock": "🔒",
  "key": "🔑",
  "hammer": "🔨",
  "axe": "🪓",
  "knife": "🔪",
  "gun": "🔫",
  "bomb": "💣",
  "medicine": "💊",
  "pill": "💊",
  "pills": "💊",
  "syringe": "💉",
  "bandage": "🩹",
  "stethoscope": "🩺",
  "microscope": "🔬",
  "telescope": "🔭",
  "magnet": "🧲",
  "earth": "🌍",
  "world": "🌎",
  "globe": "🌏",
  "map": "🗺️",
  "compass": "🧭",
  "flag": "🚩",
  "rocket": "🚀",
  "satellite": "🛰️",
  "ufo": "🛸",
  "alien": "👽",
  "robot": "🤖",
  "ghost": "👻",
  "angel": "👼",
  "devil": "😈",
  "skull": "💀",
  "poop": "💩",
  "clown": "🤡",
  "zombie": "🧟",
  "vampire": "🧛",
  "mermaid": "🧜‍♀️",
  "fairy": "🧚",
  "genie": "🧞",
  "superhero": "🦸",
  "supervillain": "🦹",
  "wizard": "🧙",
  "witch": "🧙‍♀️",
  "santa": "🎅",
  "baby": "👶",
  "child": "🧒",
  "boy": "👦",
  "girl": "👧",
  "man": "👨",
  "woman": "👩",
  "grandma": "👵",
  "grandpa": "👴",
  "family": "👪",
  "couple": "👫",
  "wedding": "💒",
  "pregnant": "🤰",
  "prince": "🤴",
  "princess": "👸",
  "police": "👮",
  "cop": "👮",
  "detective": "🕵️",
  "guard": "💂",
  "soldier": "💂",
  "construction": "👷",
  "worker": "👷",
  "farmer": "👨‍🌾",
  "cook": "👨‍🍳",
  "chef": "👨‍🍳",
  "student": "👨‍🎓",
  "teacher": "👨‍🏫",
  "professor": "👨‍🏫",
  "judge": "👨‍⚖️",
  "pilot": "👨‍✈️",
  "astronaut": "👨‍🚀",
  "artist": "👨‍🎨",
  "firefighter": "👨‍🚒",
  "doctor": "👨‍⚕️",
  "nurse": "👩‍⚕️",
  "scientist": "👨‍🔬",
  "technologist": "👨‍💻",
  "singer": "👨‍🎤",
  "office": "👨‍💼",
  "mechanic": "👨‍🔧",
  "factory": "👨‍🏭",
  "zombie": "🧟",
  "mage": "🧙",
  "fairy": "🧚",
  "vampire": "🧛",
  "merperson": "🧜",
  "elf": "🧝",
  "genie": "🧞",
  "zombie": "🧟",
  "brain": "🧠",
  "bone": "🦴",
  "tooth": "🦷",
  "foot": "🦶",
  "leg": "🦵",
  "ear": "👂",
  "nose": "👃",
  "eye": "👁️",
  "eyes": "👀",
  "tongue": "👅",
  "mouth": "👄",
  "baby": "👶",
  "child": "🧒",
  "boy": "👦",
  "girl": "👧",
  "person": "🧑",
  "blonde": "👱",
  "man": "👨",
  "woman": "👩",
  "older": "🧓",
  "oldman": "👴",
  "oldwoman": "👵",
  "yes": "✅",
  "no": "❌",
  "okay": "👌",
  "good": "👍",
  "bad": "👎",
  "great": "🙌",
  "hello": "👋",
  "hi": "👋",
  "bye": "👋",
  "please": "🙏",  "👍",
  "bad": "👎",
  "great": "🙌",
  "hello": "👋",
  "hi": "👋",
  "bye": "👋",
  "please": "🙏",
  "thank": "🙏",
  "thanks": "🙏",
  "sorry": "😔",
  "wow": "😮",
  "omg": "😱",
  "lol": "😂",
  "haha": "😄",
  "sleep": "😴",
  "tired": "😫",
  "sick": "🤒",
  "hurt": "🤕",
  "think": "🤔",
  "smart": "🧠",
  "idea": "💡",
  "time": "⏰",
  "date": "📅",
  "calendar": "📆",
  "email": "📧",
  "mail": "📬",
  "letter": "✉️",
  "write": "✍️",
  "memo": "📝",
  "note": "📝",
  "work": "💼",
  "job": "💼",
  "success": "🏆",
  "fail": "❌",
  "search": "🔍",
  "find": "🔎",
  "link": "🔗",
  "connect": "🔗",
  "warning": "⚠️",
  "danger": "☢️",
  "stop": "🛑",
  "talk": "💬",
  "speak": "🗣️",
  "listen": "👂",
  "look": "👀",
  "see": "👁️",
  "touch": "👆",
  "point": "👉",
  "finger": \"👆",
  "hand": "✋",
  "clap": "👏",
  "pray": "🙏",
  "muscle": "💪",
  "strong": "💪",
  "weak": "🤕",
  "run": "🏃",
  "walk": "🚶",
  "jump": "⛷️",
  "swim": "🏊",
  "fly": "✈️",
  "fast": "⚡",
  "slow": "🐢",
  "open": "📖",
  "close": "📕",
  "lock": "🔒",
  "unlock": "🔓",
  "key": "🔑",
  "password": "🔑",
  "secret": "🤫",
  "quiet": "🤫",
  "loud": "📢",
  "sound": "🔊",
  "mute": "🔇",
  "bell": "🔔",
  "alarm": "⏰",
  "sleep": "😴",
  "dream": "💭",
  "night": "🌙",
  "day": "☀️",
  "morning": "🌅",
  "evening": "🌆",
  "spring": "🌸",
  "summer": "☀️",
  "fall": "🍂",
  "autumn": "🍂",
  "winter": "❄️",
}

export default function TextToEmoji() {
  const [inputText, setInputText] = useState("")
  const [outputText, setOutputText] = useState("")
  const [replaceAll, setReplaceAll] = useState(false)
  const { toast } = useToast()

  const convertToEmoji = () => {
    if (!inputText.trim()) {
      toast({
        title: "Empty input",
        description: "Please enter some text to convert",
        variant: "destructive",
      })
      return
    }

    let result = inputText

    if (replaceAll) {
      // Replace all occurrences of words with emojis
      const words = Object.keys(emojiMap)
      for (const word of words) {
        const regex = new RegExp(`\\b${word}\\b`, "gi")
        result = result.replace(regex, emojiMap[word])
      }
    } else {
      // Only add emojis after words, keeping the original text
      const words = Object.keys(emojiMap)
      for (const word of words) {
        const regex = new RegExp(`\\b${word}\\b`, "gi")
        result = result.replace(regex, (match) => `${match} ${emojiMap[word.toLowerCase()]}`)
      }
    }

    setOutputText(result)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText)
    toast({
      title: "Copied!",
      description: "Emoji text copied to clipboard",
    })
  }

  const handleClear = () => {
    setInputText("")
    setOutputText("")
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Text to Emoji Converter</CardTitle>
            <CardDescription>Convert text to related emojis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Textarea
                placeholder="Enter text to convert to emojis..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={6}
                className="resize-none"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="replace-all"
                checked={replaceAll}
                onCheckedChange={(checked) => setReplaceAll(checked === true)}
              />
              <Label htmlFor="replace-all">Replace words with emojis (instead of adding emojis)</Label>
            </div>

            <div className="space-y-2">
              <Textarea
                value={outputText}
                readOnly
                rows={6}
                className="resize-none"
                placeholder="Emoji text will appear here..."
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleClear}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Clear
            </Button>
            <div className="flex space-x-2">
              <Button onClick={convertToEmoji} disabled={!inputText.trim()}>
                <Sparkles className="mr-2 h-4 w-4" />
                Convert
              </Button>
              <Button variant="outline" onClick={handleCopy} disabled={!outputText}>
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>About Text to Emoji</CardTitle>
            <CardDescription>How to use the emoji converter</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">How It Works</h3>
              <p className="text-sm text-muted-foreground">
                This tool scans your text for words that have corresponding emojis and either adds the emoji after the
                word or replaces the word with an emoji, depending on your settings.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Options</h3>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
                <li>
                  <strong>Add emojis:</strong> Keeps your original text and adds emojis after relevant words
                </li>
                <li>
                  <strong>Replace with emojis:</strong> Replaces words with their corresponding emojis
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Examples</h3>
              <div className="grid grid-cols-1 gap-2">
                <Button
                  variant="outline"
                  className="justify-start h-auto py-2 px-3"
                  onClick={() => setInputText("I love pizza and ice cream!")}
                >
                  <span className="text-left text-sm">I love pizza and ice cream!</span>
                </Button>
                <Button
                  variant="outline"
                  className="justify-start h-auto py-2 px-3"
                  onClick={() => setInputText("The cat and dog are playing in the house while the sun is shining.")}
                >
                  <span className="text-left text-sm">
                    The cat and dog are playing in the house while the sun is shining.
                  </span>
                </Button>
                <Button
                  variant="outline"
                  className="justify-start h-auto py-2 px-3"
                  onClick={() => setInputText("Happy birthday! I got you a gift and cake.")}
                >
                  <span className="text-left text-sm">Happy birthday! I got you a gift and cake.</span>
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Use Cases</h3>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
                <li>Make your social media posts more engaging</li>
                <li>Add visual elements to messages and emails</li>
                <li>Create fun and expressive content</li>
                <li>Make your writing more accessible and emotional</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
