plugins {
    id("com.android.application")
    id("com.google.gms.google-services")
}

android {
    compileSdk = 33

    defaultConfig {
        applicationId = "com.companyname.appname"
        minSdk = 21
        targetSdk = 33
        versionCode = 1
        versionName = "1.0"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
        }
    }
}

dependencies {
    implementation("com.google.firebase:firebase-auth:21.0.1") // Firebase Authentication
    implementation("com.google.firebase:firebase-firestore:24.0.2") // Firebase Firestore (opsional)
    implementation("com.google.firebase:firebase-analytics:21.0.0") // Firebase Analytics (opsional)
}
