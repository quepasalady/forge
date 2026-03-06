'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
type Page = 'dashboard' | 'workouts' | 'nutrition' | 'weight' | 'subscription'
type WorkoutMode = 'auto' | 'assisted'

interface Exercise {
  id: number
  name: string
  emoji: string
  sets: number
  reps: number
  rest: number
  desc: string
}

interface Workout {
  id: string
  name: string
  emoji: string
  muscles: string
  exercises: Exercise[]
}

const WORKOUTS: Record<string, Workout> = {
  chest: {
    id: 'chest',
    name: 'CHEST',
    emoji: '💪',
    muscles: 'Pectorals, Triceps',
    exercises: [
      { id: 1, name: 'Bench Press', emoji: '🏋️', sets: 4, reps: 8, rest: 90, desc: 'Classic compound movement for chest' },
      { id: 2, name: 'Incline Dumbbell Press', emoji: '🏋️', sets: 3, reps: 10, rest: 60, desc: 'Upper chest focus' },
      { id: 3, name: 'Cable Flyes', emoji: '🔗', sets: 3, reps: 12, rest: 45, desc: 'Isolation exercise' }
    ]
  },
  back: {
    id: 'back',
    name: 'BACK',
    emoji: '🔙',
    muscles: 'Lats, Traps, Rhomboids',
    exercises: [
      { id: 4, name: 'Deadlifts', emoji: '⬆️', sets: 4, reps: 6, rest: 120, desc: 'Heavy compound' },
      { id: 5, name: 'Pull-ups', emoji: '📍', sets: 4, reps: 8, rest: 90, desc: 'Bodyweight pull' },
      { id: 6, name: 'Barbell Rows', emoji: '↔️', sets: 3, reps: 8, rest: 90, desc: 'Back width' }
    ]
  },
  legs: {
    id: 'legs',
    name: 'LEGS',
    emoji: '🦵',
    muscles: 'Quads, Hamstrings, Glutes',
    exercises: [
      { id: 7, name: 'Squats', emoji: '🦵', sets: 4, reps: 8, rest: 120, desc: 'King of leg exercises' },
      { id: 8, name: 'Leg Press', emoji: '📌', sets: 3, reps: 10, rest: 60, desc: 'Machine leg press' },
      { id: 9, name: 'Leg Curls', emoji: '🔁', sets: 3, reps: 12, rest: 45, desc: 'Hamstring isolation' }
    ]
  }
}

export default function DashboardPage() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')
  const [currentWorkout, setCurrentWorkout] = useState<string | null>(null)
  const [workoutMode, setWorkoutMode] = useState<WorkoutMode>('auto')
  const [weight, setWeight] = useState('75')
  const [globalTimer, setGlobalTimer] = useState('1:30:00')
  const [restTimer, setRestTimer] = useState<number | null>(null)
  const [user, setUser] = useState<any>(null)

  // Initialize Supabase
  const supabase = createClientComponentClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      } else {
        setUser(user)
      }
    }
    getUser()
  }, [router, supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const handleStartWorkout = (workoutId: string) => {
    setCurrentWorkout(workoutId)
  }

  const handleBackToCategories = () => {
    setCurrentWorkout(null)
    setWorkoutMode('auto')
  }

  const handleSaveWeight = () => {
    if (weight) {
      alert(`⚖️ Weight saved: ${weight} kg`)
    }
  }

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase()
  }

  if (!user) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* NAVIGATION */}
      <nav className="fixed left-0 top-0 w-60 bg-black h-screen flex flex-col p-8 z-100">
        {/* Logo */}
        <div className="text-4xl font-black tracking-widest mb-10 pl-2">
          <span className="text-orange-500">FORGE</span>
        </div>

        {/* Menu */}
        <div className="flex-1 flex flex-col gap-1">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: '📊' },
            { id: 'workouts', label: 'Workouts', icon: '💪' },
            { id: 'nutrition', label: 'Nutrition', icon: '🥗' },
            { id: 'weight', label: 'Weight', icon: '⚖️' },
            { id: 'subscription', label: 'Subscription', icon: '💳' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id as Page)}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all relative ${
                currentPage === item.id
                  ? 'text-orange-500 bg-orange-500/10'
                  : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}
            >
              {currentPage === item.id && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/5 bg-orange-500 rounded-r"></div>
              )}
              <span className="text-xl w-6 text-center">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>

        {/* User Section */}
        <div className="pt-5 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3"
          >
            <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
              {getInitials(user.email)}
            </div>
            <div className="flex-1 text-left">
              <div className="text-xs font-semibold text-white">{user.email}</div>
              <div className="text-xs text-gray-500">Logout</div>
            </div>
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="ml-60 flex-1 h-screen overflow-y-auto p-10 bg-white">
        
        {/* DASHBOARD PAGE */}
        {currentPage === 'dashboard' && (
          <div className="animate-in fade-in duration-300">
            <div className="mb-8">
              <p className="text-xs text-gray-500 font-semibold tracking-widest uppercase mb-1">Welcome back</p>
              <h1 className="text-5xl font-black tracking-wide">
                FORGE <span className="text-orange-500">YOU</span>
              </h1>
            </div>

            {/* Weight Card */}
            <div className="bg-black rounded-2xl p-7 mb-7 relative overflow-hidden">
              <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-orange-500/15 border border-orange-500 opacity-40"></div>
              <p className="text-xs text-gray-500 font-bold tracking-widest uppercase mb-4">Current Weight</p>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="bg-white/10 border border-white/10 rounded-xl px-5 py-3 text-3xl font-black text-white w-40 outline-none focus:border-orange-500 focus:bg-orange-500/10 transition-all"
                />
                <span className="text-gray-500 font-bold text-lg">KG</span>
                <button
                  onClick={handleSaveWeight}
                  className="ml-auto bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-xl text-white text-xs font-bold transition-all hover:shadow-lg hover:shadow-orange-500/30"
                >
                  SAVE
                </button>
              </div>
            </div>

            {/* Overview Grid */}
            <div className="grid grid-cols-3 gap-5 mb-7">
              <div className="bg-gray-100 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer">
                <p className="text-xs text-gray-500 font-bold tracking-widest uppercase mb-2">Total Workouts</p>
                <p className="text-3xl font-black tracking-wide">42</p>
                <p className="text-xs text-gray-500 mt-1">This month</p>
              </div>
              <div className="bg-orange-500 rounded-2xl p-6 hover:shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5 transition-all cursor-pointer">
                <p className="text-xs text-white/70 font-bold tracking-widest uppercase mb-2">Current Streak</p>
                <p className="text-3xl font-black text-white tracking-wide">12</p>
                <p className="text-xs text-white/70 mt-1">Days in a row</p>
              </div>
              <div className="bg-gray-100 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer">
                <p className="text-xs text-gray-500 font-bold tracking-widest uppercase mb-2">Personal Best</p>
                <p className="text-3xl font-black tracking-wide">120kg</p>
                <p className="text-xs text-gray-500 mt-1">Bench press</p>
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={() => setCurrentPage('workouts')}
              className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-black text-2xl tracking-wider py-6 rounded-2xl transition-all hover:shadow-lg hover:shadow-orange-500/40 hover:-translate-y-0.5"
            >
              START WORKOUT
            </button>
          </div>
        )}

        {/* WORKOUTS PAGE */}
        {currentPage === 'workouts' && !currentWorkout && (
          <div className="animate-in fade-in duration-300">
            <h2 className="text-2xl font-black tracking-wide mb-4">WORKOUTS</h2>
            
            <div className="grid grid-cols-3 gap-4 mb-8">
              {Object.entries(WORKOUTS).map(([key, workout]) => (
                <button
                  key={key}
                  onClick={() => handleStartWorkout(key)}
                  className="bg-black rounded-2xl p-7 relative overflow-hidden group cursor-pointer"
                >
                  <div className="absolute inset-0 bg-orange-500 scale-x-0 group-hover:scale-x-100 transform-gpu origin-left transition-transform duration-300 rounded-2xl"></div>
                  <p className="text-4xl mb-3 relative z-10">{workout.emoji}</p>
                  <h3 className="text-2xl font-black text-white relative z-10 group-hover:text-white">{workout.name}</h3>
                  <p className="text-xs text-gray-500 mt-1.5 relative z-10 group-hover:text-white/70 transition-colors">{workout.muscles}</p>
                  <p className="text-xs text-orange-500 font-bold mt-3 relative z-10 group-hover:text-white/80">{workout.exercises.length} Exercises</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* WORKOUT SESSION PAGE */}
        {currentPage === 'workouts' && currentWorkout && (
          <div className="animate-in fade-in duration-300">
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={handleBackToCategories}
                className="bg-gray-100 hover:bg-gray-200 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors"
              >
                ← Back
              </button>
              <h2 className="text-4xl font-black">{WORKOUTS[currentWorkout].name}</h2>
            </div>

            {/* Mode Toggle */}
            <div className="flex gap-0 bg-gray-100 rounded-xl p-1 w-fit mb-7">
              <button
                onClick={() => setWorkoutMode('auto')}
                className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  workoutMode === 'auto'
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                    : 'text-gray-500'
                }`}
              >
                Auto
              </button>
              <button
                onClick={() => setWorkoutMode('assisted')}
                className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  workoutMode === 'assisted'
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                    : 'text-gray-500'
                }`}
              >
                Assisted
              </button>
            </div>

            {/* Auto Mode */}
            {workoutMode === 'auto' && (
              <div>
                {WORKOUTS[currentWorkout].exercises.map((exercise, idx) => (
                  <div key={idx} className="bg-gray-100 rounded-2xl p-6 mb-4">
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-20 h-16 rounded-xl bg-gray-800 flex items-center justify-center text-3xl flex-shrink-0 cursor-pointer relative group">
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                          <span className="text-orange-500 text-xl">▶</span>
                        </div>
                        {exercise.emoji}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-lg text-black">{exercise.name}</p>
                        <div className="flex gap-3 mt-1">
                          <span className="text-xs bg-white border border-gray-300 rounded px-2.5 py-1.5 font-bold">
                            <span className="text-orange-500">{exercise.sets}</span> Sets
                          </span>
                          <span className="text-xs bg-white border border-gray-300 rounded px-2.5 py-1.5 font-bold">
                            <span className="text-orange-500">{exercise.reps}</span> Reps
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Sets Table */}
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide pb-2.5">Set</th>
                          <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide pb-2.5">Reps</th>
                          <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide pb-2.5">Weight</th>
                          <th className="text-center text-xs font-bold text-gray-500 uppercase tracking-wide pb-2.5"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from({ length: exercise.sets }).map((_, setIdx) => (
                          <tr key={setIdx} className="hover:opacity-75">
                            <td className="py-2 text-2xl text-gray-500 font-black w-8">{setIdx + 1}</td>
                            <td className="py-2"><input type="text" value={exercise.reps} className="w-16 border-2 border-gray-300 focus:border-orange-500 outline-none px-3 py-2 rounded-lg text-sm font-bold" /></td>
                            <td className="py-2"><input type="text" placeholder="kg" className="w-16 border-2 border-gray-300 focus:border-orange-500 outline-none px-3 py-2 rounded-lg text-sm font-bold" /></td>
                            <td className="py-2 text-center">
                              <button className="w-8 h-8 rounded-lg border-2 border-gray-300 flex items-center justify-center cursor-pointer hover:border-orange-500 transition-colors">
                                ✓
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            )}

            {/* Assisted Mode */}
            {workoutMode === 'assisted' && (
              <div className="animate-in fade-in duration-300">
                <div className="bg-black rounded-2xl p-7 text-center mb-6">
                  <p className="text-5xl font-black text-orange-500">{globalTimer}</p>
                  <p className="text-xs text-gray-500 mt-1 tracking-widest uppercase">Workout time</p>
                </div>

                <div className="bg-orange-500 rounded-2xl p-7 mb-6 relative overflow-hidden">
                  <div className="absolute right-0 bottom-0 w-28 h-28 rounded-full bg-white/10"></div>
                  <p className="text-xs text-white/70 tracking-widest uppercase mb-2">Current Exercise</p>
                  <p className="text-4xl mb-4">{WORKOUTS[currentWorkout].exercises[0].emoji}</p>
                  <h3 className="text-2xl font-black text-white mb-4">{WORKOUTS[currentWorkout].exercises[0].name}</h3>
                  <div className="flex gap-6">
                    <div>
                      <p className="text-xs text-white/70 tracking-widest">Sets</p>
                      <p className="text-2xl font-black text-white">{WORKOUTS[currentWorkout].exercises[0].sets}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/70 tracking-widest">Reps</p>
                      <p className="text-2xl font-black text-white">{WORKOUTS[currentWorkout].exercises[0].reps}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/70 tracking-widest">Rest</p>
                      <p className="text-2xl font-black text-white">{WORKOUTS[currentWorkout].exercises[0].rest}s</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-2xl tracking-wider">
                    ✓ SET 1 / 4 COMPLETED
                  </button>
                  <button className="bg-gray-100 hover:bg-gray-200 text-black font-bold px-6 py-4 rounded-2xl">
                    SKIP
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* NUTRITION PAGE */}
        {currentPage === 'nutrition' && (
          <div className="animate-in fade-in duration-300">
            <h2 className="text-2xl font-black tracking-wide mb-6">NUTRITION</h2>
            <div className="text-center text-gray-500">
              <p className="text-lg">Nutrition tracking coming soon! 🥗</p>
            </div>
          </div>
        )}

        {/* WEIGHT PAGE */}
        {currentPage === 'weight' && (
          <div className="animate-in fade-in duration-300">
            <h2 className="text-2xl font-black tracking-wide mb-6">WEIGHT TRACKING</h2>
            <div className="bg-black rounded-2xl p-7 mb-6">
              <p className="text-xs text-gray-500 font-bold tracking-widest uppercase mb-4">Log Weight</p>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="bg-white/10 border border-white/10 rounded-xl px-5 py-3 text-3xl font-black text-white w-40 outline-none focus:border-orange-500"
                />
                <span className="text-gray-500 font-bold text-lg">KG</span>
                <button
                  onClick={handleSaveWeight}
                  className="ml-auto bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-xl text-white text-xs font-bold"
                >
                  SAVE
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SUBSCRIPTION PAGE */}
        {currentPage === 'subscription' && (
          <div className="animate-in fade-in duration-300">
            <h2 className="text-2xl font-black tracking-wide mb-6">SUBSCRIPTION</h2>
            <div className="grid grid-cols-3 gap-6">
              {[
                { name: 'BASIC', price: '$9', features: ['Workouts', 'Basic tracking'] },
                { name: 'PRO', price: '$19', features: ['Everything', 'Advanced stats', 'Custom plans'], highlight: true },
                { name: 'PREMIUM', price: '$29', features: ['All features', '1-on-1 coaching', 'Nutrition plans'] }
              ].map((plan, idx) => (
                <div
                  key={idx}
                  className={`rounded-2xl p-7 text-center cursor-pointer transition-all ${
                    plan.highlight
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                      : 'bg-gray-100 text-black'
                  }`}
                >
                  <h3 className="text-xl font-black mb-2">{plan.name}</h3>
                  <p className="text-3xl font-black mb-6">{plan.price}</p>
                  <ul className="space-y-2 text-sm font-bold mb-6">
                    {plan.features.map((feature, fidx) => (
                      <li key={fidx}>✓ {feature}</li>
                    ))}
                  </ul>
                  <button className={`w-full py-3 rounded-xl font-bold transition-all ${
                    plan.highlight
                      ? 'bg-white text-orange-500 hover:bg-gray-100'
                      : 'bg-orange-500 text-white hover:bg-orange-600'
                  }`}>
                    SELECT
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}