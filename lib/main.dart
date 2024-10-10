import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_web_plugins/url_strategy.dart';
import 'package:meta_seo/meta_seo.dart';
import 'package:portfolio/firebase_options.dart';
import 'package:portfolio/src/app.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  if (kIsWeb) {
    await Firebase.initializeApp(
      options: DefaultFirebaseOptions.currentPlatform,
    );
    usePathUrlStrategy();
    MetaSEO().config();
  }
  runApp(const ProviderScope(child: App()));
}
