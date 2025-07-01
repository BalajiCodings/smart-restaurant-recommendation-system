"use client"

import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Heart, User, LogOut, Settings } from "lucide-react"

export function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                TastyTrack
              </span>
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link 
                href="/restaurants" 
                className="text-gray-700 hover:text-orange-600 transition-colors duration-300 font-medium px-3 py-2 rounded-lg hover:bg-orange-50"
              >
                Restaurants
              </Link>
              {user && (
                <>
                  <Link 
                    href="/recommendations" 
                    className="text-gray-700 hover:text-orange-600 transition-colors duration-300 font-medium px-3 py-2 rounded-lg hover:bg-orange-50"
                  >
                    Recommendations
                  </Link>
                  <Link 
                    href="/favorites" 
                    className="text-gray-700 hover:text-orange-600 transition-colors duration-300 font-medium px-3 py-2 rounded-lg hover:bg-orange-50"
                  >
                    Favorites
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/restaurants">
              <Button 
                variant="ghost" 
                size="icon"
                className="hover:bg-orange-50 hover:text-orange-600 transition-colors duration-300 rounded-lg"
              >
                <Search className="h-5 w-5" />
              </Button>
            </Link>

            {user ? (
              <>
                <Link href="/favorites">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="hover:bg-red-50 hover:text-red-600 transition-colors duration-300 rounded-lg"
                  >
                    <Heart className="h-5 w-5" />
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-gray-50 transition-colors duration-300">
                      <Avatar className="h-9 w-9 ring-2 ring-orange-200 hover:ring-orange-300 transition-all duration-300">
                        <AvatarFallback className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 rounded-xl border-gray-200 shadow-xl" align="end" forceMount>
                    <div className="flex items-center justify-start gap-3 p-4 bg-gradient-to-r from-orange-50 to-red-50">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        <p className="w-[180px] truncate text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="hover:bg-orange-50 focus:bg-orange-50 cursor-pointer">
                      <Link href="/dashboard" className="w-full">
                        <User className="mr-3 h-4 w-4 text-orange-600" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="hover:bg-orange-50 focus:bg-orange-50 cursor-pointer">
                      <Link href="/preferences" className="w-full">
                        <Settings className="mr-3 h-4 w-4 text-orange-600" />
                        <span>Preferences</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={logout}
                      className="hover:bg-red-50 focus:bg-red-50 cursor-pointer text-red-600"
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex space-x-3">
                <Link href="/login">
                  <Button 
                    variant="ghost"
                    className="hover:bg-gray-50 transition-colors duration-300 rounded-lg px-4 py-2"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-lg px-4 py-2 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-orange-200">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
