import 'package:flutter/material.dart';
import 'package:portfolio/src/core/constants/app_sizes.dart';

class FeatureCard extends StatelessWidget {
  const FeatureCard({required this.title, super.key, this.removeTap});
  final String title;
  final void Function()? removeTap;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(Sizes.p8),
      child: DecoratedBox(
        decoration: BoxDecoration(
          border: Border.all(
            color: Theme.of(context).dividerColor,
          ),
        ),
        child: ListTile(
          title: Text(title),
          trailing: IconButton(
            icon: const Icon(Icons.edit),
            onPressed: removeTap,
          ),
        ),
      ),
    );
  }
}
