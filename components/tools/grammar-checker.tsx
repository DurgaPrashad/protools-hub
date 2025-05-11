"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Check, Copy, RotateCcw, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Common grammar and spelling errors to check for
const commonErrors = [
  { error: /\b(its)\s+(\w+ing)\b/gi, suggestion: "it's" }, // its vs it's
  { error: /\b(your)\s+(welcome|right)\b/gi, suggestion: "you're" }, // your vs you're
  { error: /\b(there)\s+(car|house|dog|cat|phone)\b/gi, suggestion: "their" }, // there vs their
  { error: /\b(they're)\s+(car|house|dog|cat|phone)\b/gi, suggestion: "their" }, // they're vs their
  { error: /\b(their)\s+(going|coming|running|walking)\b/gi, suggestion: "they're" }, // their vs they're
  { error: /\b(to)\s+(much|many|busy|late|early|good|bad)\b/gi, suggestion: "too" }, // to vs too
  { error: /\b(then)\s+(I|we|he|she|they|it)\b/gi, suggestion: "than" }, // then vs than
  { error: /\b(affect)\s+(on)\b/gi, suggestion: "effect" }, // affect vs effect
  { error: /\b(effect)\s+(the|a|an)\s+(change|outcome|result)\b/gi, suggestion: "affect" }, // effect vs affect
  { error: /\b(accept)\s+(for|that|this)\b/gi, suggestion: "except" }, // accept vs except
  { error: /\b(except)\s+(the|a|an|this|that)\s+(offer|invitation|apology)\b/gi, suggestion: "accept" }, // except vs accept
  { error: /\b(advice)\s+(you|him|her|them|me)\b/gi, suggestion: "advise" }, // advice vs advise
  { error: /\b(loose)\s+(the|a|an|this|that)\b/gi, suggestion: "lose" }, // loose vs lose
  {
    error: /\b(principle)\s+(of|in)\s+(the|a|an|this|that)\s+(school|company|organization)\b/gi,
    suggestion: "principal",
  }, // principle vs principal
  { error: /\b(principal)\s+(of|in)\s+(the|a|an|this|that)\s+(matter|issue|concern)\b/gi, suggestion: "principle" }, // principal vs principle
  { error: /\b(stationary)\s+(bike|car|vehicle|object)\b/gi, suggestion: "stationery" }, // stationary vs stationery
  { error: /\b(stationery)\s+(position|location|place)\b/gi, suggestion: "stationary" }, // stationery vs stationary
  { error: /\b(compliment)\s+(with|to)\b/gi, suggestion: "complement" }, // compliment vs complement
  { error: /\b(complement)\s+(on|about)\s+(the|a|an|this|that)\b/gi, suggestion: "compliment" }, // complement vs compliment
  { error: /\b(alot)\b/gi, suggestion: "a lot" }, // alot vs a lot
  {
    error: /\b(could of|should of|would of|must of|might of)\b/gi,
    suggestion: "could have/should have/would have/must have/might have",
  }, // could of vs could have
  { error: /\b(irregardless)\b/gi, suggestion: "regardless" }, // irregardless vs regardless
  { error: /\b(supposably)\b/gi, suggestion: "supposedly" }, // supposably vs supposedly
  { error: /\b(definately)\b/gi, suggestion: "definitely" }, // definately vs definitely
  { error: /\b(seperate)\b/gi, suggestion: "separate" }, // seperate vs separate
  { error: /\b(wierd)\b/gi, suggestion: "weird" }, // wierd vs weird
  { error: /\b(recieve)\b/gi, suggestion: "receive" }, // recieve vs receive
  { error: /\b(ect)\b/gi, suggestion: "etc" }, // ect vs etc
  { error: /\b(concious)\b/gi, suggestion: "conscious" }, // concious vs conscious
  { error: /\b(occured)\b/gi, suggestion: "occurred" }, // occured vs occurred
  { error: /\b(untill)\b/gi, suggestion: "until" }, // untill vs until
  { error: /\b(greatful)\b/gi, suggestion: "grateful" }, // greatful vs grateful
  { error: /\b(truely)\b/gi, suggestion: "truly" }, // truely vs truly
  { error: /\b(tommorrow)\b/gi, suggestion: "tomorrow" }, // tommorrow vs tomorrow
  { error: /\b(accross)\b/gi, suggestion: "across" }, // accross vs across
  { error: /\b(beleive)\b/gi, suggestion: "believe" }, // beleive vs believe
  { error: /\b(gaurd)\b/gi, suggestion: "guard" }, // gaurd vs guard
  { error: /\b(independant)\b/gi, suggestion: "independent" }, // independant vs independent
  { error: /\b(occassion)\b/gi, suggestion: "occasion" }, // occassion vs occasion
  { error: /\b(publically)\b/gi, suggestion: "publicly" }, // publically vs publicly
  { error: /\b(restaraunt)\b/gi, suggestion: "restaurant" }, // restaraunt vs restaurant
  { error: /\b(goverment)\b/gi, suggestion: "government" }, // goverment vs government
  { error: /\b(priviledge)\b/gi, suggestion: "privilege" }, // priviledge vs privilege
  { error: /\b(acheive)\b/gi, suggestion: "achieve" }, // acheive vs achieve
  { error: /\b(begining)\b/gi, suggestion: "beginning" }, // begining vs beginning
  { error: /\b(bussiness)\b/gi, suggestion: "business" }, // bussiness vs business
  { error: /\b(calender)\b/gi, suggestion: "calendar" }, // calender vs calendar
  { error: /\b(catagory)\b/gi, suggestion: "category" }, // catagory vs category
  { error: /\b(cemetary)\b/gi, suggestion: "cemetery" }, // cemetary vs cemetery
  { error: /\b(collegue)\b/gi, suggestion: "colleague" }, // collegue vs colleague
  { error: /\b(comming)\b/gi, suggestion: "coming" }, // comming vs coming
  { error: /\b(commitee)\b/gi, suggestion: "committee" }, // commitee vs committee
  { error: /\b(completly)\b/gi, suggestion: "completely" }, // completly vs completely
  { error: /\b(concensus)\b/gi, suggestion: "consensus" }, // concensus vs consensus
  { error: /\b(critisism)\b/gi, suggestion: "criticism" }, // critisism vs criticism
  { error: /\b(decieve)\b/gi, suggestion: "deceive" }, // decieve vs deceive
  { error: /\b(desparate)\b/gi, suggestion: "desperate" }, // desparate vs desperate
  { error: /\b(dissapear)\b/gi, suggestion: "disappear" }, // dissapear vs disappear
  { error: /\b(dissapoint)\b/gi, suggestion: "disappoint" }, // dissapoint vs disappoint
  { error: /\b(embarass)\b/gi, suggestion: "embarrass" }, // embarass vs embarrass
  { error: /\b(enviroment)\b/gi, suggestion: "environment" }, // enviroment vs environment
  { error: /\b(exagerate)\b/gi, suggestion: "exaggerate" }, // exagerate vs exaggerate
  { error: /\b(existance)\b/gi, suggestion: "existence" }, // existance vs existence
  { error: /\b(familar)\b/gi, suggestion: "familiar" }, // familar vs familiar
  { error: /\b(finaly)\b/gi, suggestion: "finally" }, // finaly vs finally
  { error: /\b(foriegn)\b/gi, suggestion: "foreign" }, // foriegn vs foreign
  { error: /\b(freind)\b/gi, suggestion: "friend" }, // freind vs friend
  { error: /\b(garantee)\b/gi, suggestion: "guarantee" }, // garantee vs guarantee
  { error: /\b(grammer)\b/gi, suggestion: "grammar" }, // grammer vs grammar
  { error: /\b(harrass)\b/gi, suggestion: "harass" }, // harrass vs harass
  { error: /\b(hight)\b/gi, suggestion: "height" }, // hight vs height
  { error: /\b(immediatly)\b/gi, suggestion: "immediately" }, // immediatly vs immediately
  { error: /\b(incidently)\b/gi, suggestion: "incidentally" }, // incidently vs incidentally
  { error: /\b(interupt)\b/gi, suggestion: "interrupt" }, // interupt vs interrupt
  { error: /\b(knowlege)\b/gi, suggestion: "knowledge" }, // knowlege vs knowledge
  { error: /\b(liason)\b/gi, suggestion: "liaison" }, // liason vs liaison
  { error: /\b(libary)\b/gi, suggestion: "library" }, // libary vs library
  { error: /\b(lisence)\b/gi, suggestion: "license" }, // lisence vs license
  { error: /\b(maintainance)\b/gi, suggestion: "maintenance" }, // maintainance vs maintenance
  { error: /\b(millenium)\b/gi, suggestion: "millennium" }, // millenium vs millennium
  { error: /\b(miniscule)\b/gi, suggestion: "minuscule" }, // miniscule vs minuscule
  { error: /\b(mispell)\b/gi, suggestion: "misspell" }, // mispell vs misspell
  { error: /\b(neccessary)\b/gi, suggestion: "necessary" }, // neccessary vs necessary
  { error: /\b(noticable)\b/gi, suggestion: "noticeable" }, // noticable vs noticeable
  { error: /\b(occassionally)\b/gi, suggestion: "occasionally" }, // occassionally vs occasionally
  { error: /\b(occurance)\b/gi, suggestion: "occurrence" }, // occurance vs occurrence
  { error: /\b(persistant)\b/gi, suggestion: "persistent" }, // persistant vs persistent
  { error: /\b(personel)\b/gi, suggestion: "personnel" }, // personel vs personnel
  { error: /\b(persue)\b/gi, suggestion: "pursue" }, // persue vs pursue
  { error: /\b(posession)\b/gi, suggestion: "possession" }, // posession vs possession
  { error: /\b(prefered)\b/gi, suggestion: "preferred" }, // prefered vs preferred
  { error: /\b(probly)\b/gi, suggestion: "probably" }, // probly vs probably
  { error: /\b(pronounciation)\b/gi, suggestion: "pronunciation" }, // pronounciation vs pronunciation
  { error: /\b(queston)\b/gi, suggestion: "question" }, // queston vs question
  { error: /\b(recieve)\b/gi, suggestion: "receive" }, // recieve vs receive
  { error: /\b(recomend)\b/gi, suggestion: "recommend" }, // recomend vs recommend
  { error: /\b(refered)\b/gi, suggestion: "referred" }, // refered vs referred
  { error: /\b(relevent)\b/gi, suggestion: "relevant" }, // relevent vs relevant
  { error: /\b(religous)\b/gi, suggestion: "religious" }, // religous vs religious
  { error: /\b(rember)\b/gi, suggestion: "remember" }, // rember vs remember
  { error: /\b(resistence)\b/gi, suggestion: "resistance" }, // resistence vs resistance
  { error: /\b(sence)\b/gi, suggestion: "sense" }, // sence vs sense
  { error: /\b(seperate)\b/gi, suggestion: "separate" }, // seperate vs separate
  { error: /\b(succesful)\b/gi, suggestion: "successful" }, // succesful vs successful
  { error: /\b(suprise)\b/gi, suggestion: "surprise" }, // suprise vs surprise
  { error: /\b(temperture)\b/gi, suggestion: "temperature" }, // temperture vs temperature
  { error: /\b(tendancy)\b/gi, suggestion: "tendency" }, // tendancy vs tendency
  { error: /\b(thier)\b/gi, suggestion: "their" }, // thier vs their
  { error: /\b(tomatos)\b/gi, suggestion: "tomatoes" }, // tomatos vs tomatoes
  { error: /\b(tommorrow)\b/gi, suggestion: "tomorrow" }, // tommorrow vs tomorrow
  { error: /\b(vaccum)\b/gi, suggestion: "vacuum" }, // vaccum vs vacuum
  { error: /\b(wether)\b/gi, suggestion: "whether" }, // wether vs whether
  { error: /\b(whos)\b/gi, suggestion: "who's" }, // whos vs who's
  { error: /\b(writting)\b/gi, suggestion: "writing" }, // writting vs writing
  { error: /\b(youre)\b/gi, suggestion: "you're" }, // youre vs you're
]

// Double word errors (e.g., "the the")
const doubleWordRegex = /\b(\w+)\s+\1\b/gi

// Punctuation errors
const punctuationErrors = [
  { error: /\s+([.,;:!?])/g, suggestion: "$1" }, // space before punctuation
  { error: /([.,;:!?])([A-Za-z])/g, suggestion: "$1 $2" }, // no space after punctuation
]

// Capitalization errors
const capitalizationErrors = [
  { error: /^([a-z])/gm, suggestion: (match: string) => match.toUpperCase() }, // sentence start
  { error: /\.\s+([a-z])/g, suggestion: (match: string, p1: string) => ". " + p1.toUpperCase() }, // after period
  { error: /!\s+([a-z])/g, suggestion: (match: string, p1: string) => "! " + p1.toUpperCase() }, // after exclamation
  { error: /\?\s+([a-z])/g, suggestion: (match: string, p1: string) => "? " + p1.toUpperCase() }, // after question
]

// Run-on sentence detection (simplified)
const runOnSentenceRegex = /[a-z][.!?]\s+[a-z][^.!?]{40,}[.!?]/gi

interface GrammarError {
  type: string
  error: string
  suggestion: string
  position: {
    start: number
    end: number
  }
}

export default function GrammarChecker() {
  const [inputText, setInputText] = useState("")
  const [correctedText, setCorrectedText] = useState("")
  const [errors, setErrors] = useState<GrammarError[]>([])
  const [isChecking, setIsChecking] = useState(false)
  const { toast } = useToast()

  const checkGrammar = () => {
    if (!inputText.trim()) {
      toast({
        title: "Empty input",
        description: "Please enter some text to check",
        variant: "destructive",
      })
      return
    }

    setIsChecking(true)
    const foundErrors: GrammarError[] = []
    const text = inputText

    // Check for common grammar and spelling errors
    commonErrors.forEach(({ error, suggestion }) => {
      const matches = [...text.matchAll(error)]
      matches.forEach((match) => {
        if (match.index !== undefined) {
          foundErrors.push({
            type: "grammar/spelling",
            error: match[0],
            suggestion: match[0].replace(error, suggestion),
            position: {
              start: match.index,
              end: match.index + match[0].length,
            },
          })
        }
      })
    })

    // Check for double words
    const doubleWordMatches = [...text.matchAll(doubleWordRegex)]
    doubleWordMatches.forEach((match) => {
      if (match.index !== undefined) {
        foundErrors.push({
          type: "double word",
          error: match[0],
          suggestion: match[1],
          position: {
            start: match.index,
            end: match.index + match[0].length,
          },
        })
      }
    })

    // Check for punctuation errors
    punctuationErrors.forEach(({ error, suggestion }) => {
      const matches = [...text.matchAll(error)]
      matches.forEach((match) => {
        if (match.index !== undefined) {
          foundErrors.push({
            type: "punctuation",
            error: match[0],
            suggestion: match[0].replace(error, suggestion as string),
            position: {
              start: match.index,
              end: match.index + match[0].length,
            },
          })
        }
      })
    })

    // Check for capitalization errors
    capitalizationErrors.forEach(({ error, suggestion }) => {
      const matches = [...text.matchAll(error)]
      matches.forEach((match) => {
        if (match.index !== undefined) {
          const suggestionFunc = suggestion as (match: string, p1: string) => string
          foundErrors.push({
            type: "capitalization",
            error: match[0],
            suggestion:
              typeof suggestion === "string" ? match[0].replace(error, suggestion) : suggestionFunc(match[0], match[1]),
            position: {
              start: match.index,
              end: match.index + match[0].length,
            },
          })
        }
      })
    })

    // Check for run-on sentences
    const runOnMatches = [...text.matchAll(runOnSentenceRegex)]
    runOnMatches.forEach((match) => {
      if (match.index !== undefined) {
        foundErrors.push({
          type: "run-on sentence",
          error: match[0],
          suggestion: "Consider breaking this into multiple sentences",
          position: {
            start: match.index,
            end: match.index + match[0].length,
          },
        })
      }
    })

    // Apply corrections to text
    let corrected = text
    // Sort errors by position (from end to start to avoid index shifting)
    const sortedErrors = [...foundErrors].sort((a, b) => b.position.start - a.position.start)

    sortedErrors.forEach((error) => {
      if (error.type !== "run-on sentence") {
        corrected =
          corrected.substring(0, error.position.start) + error.suggestion + corrected.substring(error.position.end)
      }
    })

    setCorrectedText(corrected)
    setErrors(foundErrors)
    setIsChecking(false)

    if (foundErrors.length === 0) {
      toast({
        title: "No errors found",
        description: "Your text looks good!",
      })
    } else {
      toast({
        title: `Found ${foundErrors.length} issue${foundErrors.length === 1 ? "" : "s"}`,
        description: "See the suggestions below",
        variant: "destructive",
      })
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(correctedText || inputText)
    toast({
      title: "Copied!",
      description: "Text copied to clipboard",
    })
  }

  const handleClear = () => {
    setInputText("")
    setCorrectedText("")
    setErrors([])
  }

  const applyCorrections = () => {
    setInputText(correctedText)
    setCorrectedText("")
    setErrors([])
    toast({
      title: "Corrections applied",
      description: "All suggested corrections have been applied",
    })
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Grammar Checker</CardTitle>
            <CardDescription>Check text for grammar and spelling errors</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Textarea
                placeholder="Enter text to check for grammar and spelling errors..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={8}
                className="resize-none"
              />
            </div>

            {errors.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Suggested Corrections:</h3>
                <div className="max-h-40 overflow-y-auto border rounded-md p-2">
                  {errors.map((error, index) => (
                    <div key={index} className="text-sm mb-2 pb-2 border-b last:border-0">
                      <div className="flex items-start">
                        <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2 mt-0.5" />
                        <div>
                          <p className="font-medium">{error.type.charAt(0).toUpperCase() + error.type.slice(1)}</p>
                          <p className="text-muted-foreground">
                            <span className="line-through">{error.error}</span> →{" "}
                            <span className="font-medium">{error.suggestion}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {correctedText && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Corrected Text:</h3>
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-3 text-sm">
                  {correctedText}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleClear}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Clear
            </Button>
            <div className="flex space-x-2">
              {correctedText ? (
                <Button onClick={applyCorrections}>
                  <Check className="mr-2 h-4 w-4" />
                  Apply Corrections
                </Button>
              ) : (
                <Button onClick={checkGrammar} disabled={!inputText.trim() || isChecking}>
                  {isChecking ? "Checking..." : "Check Grammar"}
                </Button>
              )}
              <Button variant="outline" onClick={handleCopy} disabled={!inputText}>
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>About Grammar Checker</CardTitle>
            <CardDescription>How this tool helps improve your writing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">What This Tool Checks</h3>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
                <li>Common spelling errors</li>
                <li>Grammar mistakes</li>
                <li>Punctuation errors</li>
                <li>Capitalization issues</li>
                <li>Double words</li>
                <li>Run-on sentences</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Common Grammar Mistakes</h3>
              <div className="grid grid-cols-1 gap-2">
                <div className="p-2 bg-muted rounded-md text-sm">
                  <p className="font-medium">Your vs. You're</p>
                  <p className="text-muted-foreground">
                    <span className="line-through">Your going to love this tool.</span> →{" "}
                    <span>You're going to love this tool.</span>
                  </p>
                </div>
                <div className="p-2 bg-muted rounded-md text-sm">
                  <p className="font-medium">Its vs. It's</p>
                  <p className="text-muted-foreground">
                    <span className="line-through">Its going to rain today.</span> →{" "}
                    <span>It's going to rain today.</span>
                  </p>
                </div>
                <div className="p-2 bg-muted rounded-md text-sm">
                  <p className="font-medium">There vs. Their vs. They're</p>
                  <p className="text-muted-foreground">
                    <span className="line-through">There going to the store.</span> →{" "}
                    <span>They're going to the store.</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Limitations</h3>
              <p className="text-sm text-muted-foreground">
                This tool provides basic grammar and spelling checks. For more advanced writing assistance, consider
                using specialized grammar tools like Grammarly or ProWritingAid.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
